'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './Chart.css';
import {RightPanel} from "../panel/RightPanel";

const Chart = () => {
    const [selectedDate, setSelectedDate] = useState(null);
    const [activeYear, setActiveYear] = useState(new Date().getFullYear());
    const [activeMonth, setActiveMonth] = useState(new Date().getMonth() + 1);
    const [events, setEvents] = useState({});
    const [shoppingLists, setShoppingLists] = useState({});
    const [isClient, setIsClient] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selectedWeek, setSelectedWeek] = useState(null);
    const [activeRegister, setActiveRegister] = useState(null);
    const [allMeals, setAllMeals] = useState([]);
    const shoppingListRef = useRef(null);

    const getWeekNumberForDate = useCallback((date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const day = date.getDate();
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        let currentWeek = 0;

        for (let d = 1; d <= day; d++) {
            const weekday = (firstDayOfMonth + d - 1) % 7;
            if (d === 1 || weekday === 1) currentWeek++;
        }
        return currentWeek.toString();
    }, []);

    const fetchAllMeals = useCallback(async () => {
        try {
            const response = await fetch('/api/allMeals');
            const data = await response.json();
            setAllMeals(data);
        } catch (error) {
            console.error('Error fetching meals:', error);
        }
    }, []);

    const handleCreateMeal = useCallback(async ({ mealName, ingredients }) => {
        if (!mealName || !ingredients) return;

        try {
            const response = await fetch('/api/foodPlan', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    mealName,
                    ingredients: ingredients.split(',').map(i => i.trim())
                })
            });

            if (response.ok) fetchAllMeals();
        } catch (error) {
            console.error('Error creating meal:', error);
        }
    }, [fetchAllMeals]);

    const handleDeleteMeal = useCallback(async (mealName) => {
        if (!window.confirm(`Delete meal "${mealName}" permanently?`)) return;

        try {
            const response = await fetch(`/api/allMeals?mealName=${encodeURIComponent(mealName)}`, {
                method: 'DELETE'
            });
            const data = await response.json();

            if (data.success) fetchAllMeals();
            else alert(`Error: ${data.message}`);
        } catch (error) {
            console.error('Delete failed:', error);
            alert('Failed to delete meal');
        }
    }, [fetchAllMeals]);

    const loadSavedPlanner = useCallback(() => {
        const savedPlanner = localStorage.getItem('foodPlanner');
        if (savedPlanner) {
            try {
                const storedData = JSON.parse(savedPlanner);
                const allPlans = Array.isArray(storedData) ? storedData : [storedData];
                const currentPlan = allPlans.find(plan =>
                    plan.year === activeYear && plan.month === activeMonth
                );

                if (currentPlan) {
                    setEvents(currentPlan.events || {});
                    setShoppingLists(currentPlan.shoppingLists || {});
                } else {
                    setEvents({});
                    setShoppingLists({});
                }
            } catch (error) {
                console.error('Error parsing saved planner:', error);
                setEvents({});
                setShoppingLists({});
            }
        } else {
            setEvents({});
            setShoppingLists({});
        }
    }, [activeYear, activeMonth]);

    const generateFoodPlan = useCallback(async () => {
        let allPlans = [];
        try {
            const savedPlanner = localStorage.getItem('foodPlanner');
            if (savedPlanner) allPlans = JSON.parse(savedPlanner);
        } catch (error) {
            console.error('Error parsing existing plans:', error);
        }

        const existingPlanIndex = allPlans.findIndex(plan =>
            plan.year === activeYear && plan.month === activeMonth
        );

        if (existingPlanIndex !== -1 && !window.confirm('Overwrite existing plan?')) return;

        setLoading(true);
        try {
            const response = await fetch(`/api/foodPlan?year=${activeYear}&month=${activeMonth}`);
            const { mealPlan, shoppingLists } = await response.json();

            const newEvents = {};
            Object.entries(mealPlan).forEach(([day, meals]) => {
                const date = new Date(activeYear, activeMonth - 1, day);
                newEvents[date.toISOString().split('T')[0]] = meals;
            });

            const newPlan = {
                year: activeYear,
                month: activeMonth,
                events: newEvents,
                shoppingLists
            };

            const updatedPlans = existingPlanIndex !== -1
                ? allPlans.map((plan, index) => index === existingPlanIndex ? newPlan : plan)
                : [...allPlans, newPlan];

            localStorage.setItem('foodPlanner', JSON.stringify(updatedPlans));
            setEvents(newEvents);
            setShoppingLists(shoppingLists);
        } catch (error) {
            console.error('Error generating food plan:', error);
        }
        setLoading(false);
    }, [activeYear, activeMonth]);

    const deleteFoodPlan = useCallback(() => {
        if (!window.confirm(`Are you sure you want to delete the plan for ${new Date(activeYear, activeMonth - 1).toLocaleString('default', {month: 'long'})}?`)) {
            return;
        }

        try {
            const savedPlanner = localStorage.getItem('foodPlanner');
            if (!savedPlanner) return;

            const allPlans = JSON.parse(savedPlanner);
            const updatedPlans = allPlans.filter(plan => !(plan.year === activeYear && plan.month === activeMonth));

            localStorage.setItem('foodPlanner', JSON.stringify(updatedPlans));

            // Clear the displayed plan
            setEvents({});
            setShoppingLists({});
        } catch (error) {
            console.error('Error deleting month plan:')
        }
    }, [activeYear, activeMonth]);

    const handleDateChange = useCallback((date) => {
        setSelectedDate(date);
        setSelectedWeek(getWeekNumberForDate(date));
    }, [getWeekNumberForDate]);

    const handleActiveStartDateChange = useCallback(({ activeStartDate }) => {
        const newYear = activeStartDate.getFullYear();
        const newMonth = activeStartDate.getMonth() + 1;
        if (newYear !== activeYear || newMonth !== activeMonth) {
            setActiveYear(newYear);
            setActiveMonth(newMonth);
        }
    }, [activeYear, activeMonth]);

    const tileContent = ({ date }) => {
        const dateString = date.toISOString().split('T')[0];
        const dayEvents = events[dateString];
        return dayEvents ? (
            <div className="event-badge">
                {dayEvents.map((event, index) => (
                    <div key={index} className="event-item">{event}</div>
                ))}
            </div>
        ) : null;
    };

    useEffect(() => {
        setIsClient(true);
        loadSavedPlanner();
    }, [loadSavedPlanner]);

    useEffect(() => {
        if (shoppingListRef.current) shoppingListRef.current.scrollTop = 0;
    }, [selectedWeek]);

    useEffect(() => {
        const handleMonthClick = (event) => {
            const navigation = document.querySelector('.react-calendar__navigation__label');
            if (navigation && navigation.contains(event.target)) {
                setActiveYear(new Date().getFullYear());
                setActiveMonth(new Date().getMonth() + 1);
                setSelectedDate(new Date());
            }
        };
        document.addEventListener('click', handleMonthClick);
        return () => document.removeEventListener('click', handleMonthClick);
    }, []);


    if (!isClient) return null;

    return (
        <div className="calendar-container">
            <h1>Food Planner</h1>
            <div className="layout-wrapper">
                <Calendar
                    onChange={handleDateChange}
                    onActiveStartDateChange={handleActiveStartDateChange}
                    value={selectedDate}
                    tileContent={tileContent}
                    className="react-calendar"
                    activeStartDate={new Date(activeYear, activeMonth - 1)}
                    view="month"
                />
                <RightPanel
                    activeYear={activeYear}
                    activeMonth={activeMonth}
                    activeRegister={activeRegister}
                    setActiveRegister={setActiveRegister}
                    generateFoodPlan={generateFoodPlan}
                    deleteFoodPlan={deleteFoodPlan}
                    loading={loading}
                    shoppingLists={shoppingLists}
                    selectedWeek={selectedWeek}
                    selectedDate={selectedDate}
                    events={events}
                    handleCreateMeal={handleCreateMeal}
                    allMeals={allMeals}
                    handleDeleteMeal={handleDeleteMeal}
                    fetchAllMeals={fetchAllMeals}
                />
            </div>
        </div>
    );
};

export default Chart;