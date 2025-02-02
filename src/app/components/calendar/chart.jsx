'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './chart.css';

const MyCalendar = () => {
    const [selectedDate, setSelectedDate] = useState(null);
    const [activeYear, setActiveYear] = useState(new Date().getFullYear());
    const [activeMonth, setActiveMonth] = useState(new Date().getMonth() + 1);
    const [events, setEvents] = useState({});
    const [shoppingLists, setShoppingLists] = useState({});
    const [isClient, setIsClient] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selectedWeek, setSelectedWeek] = useState(null);
    const shoppingListRef = useRef(null);
    const [activeRegister, setActiveRegister] = useState(null);
    const [allMeals, setAllMeals] = useState([]);

    // Add this new function to fetch all meals
    const fetchAllMeals = useCallback(async () => {
        try {
            const response = await fetch('/api/allMeals');
            const data = await response.json();
            setAllMeals(data);
        } catch (error) {
            console.error('Error fetching meals:', error);
        }
    }, []);

    // Add this new function to handle meal creation
    const mealNameRef = useRef('');
    const ingredientsRef = useRef('');

    const handleCreateMeal = async () => {
        const mealName = mealNameRef.current.value.trim();
        const ingredients = ingredientsRef.current.value.trim();

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

            if (response.ok) {
                mealNameRef.current.value = '';
                ingredientsRef.current.value = '';
                fetchAllMeals();
            }
        } catch (error) {
            console.error('Error creating meal:', error);
        }
    };

    const handleDeleteMeal = async (mealName) => {
        if (!window.confirm(`Delete meal "${mealName}" permanently?`)) return;

        try {
            const response = await fetch(`/api/allMeals?mealName=${encodeURIComponent(mealName)}`, {
                method: 'DELETE'
            });
            const data = await response.json();

            if (data.success) {
                fetchAllMeals();
            } else {
                alert(`Error: ${data.message}`);
            }
        } catch (error) {
            console.error('Delete failed:', error);
            alert('Failed to delete meal');
        }
    };


    const getWeekNumberForDate = useCallback((date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const day = date.getDate();
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        let currentWeek = 0;

        for (let d = 1; d <= day; d++) {
            const weekday = (firstDayOfMonth + d - 1) % 7;
            if (d === 1 || weekday === 1) {
                currentWeek++;
            }
        }
        return currentWeek.toString();
    }, []);

    useEffect(() => {
        if (shoppingListRef.current) {
            shoppingListRef.current.scrollTop = 0;
        }
    }, [selectedWeek]);

    useEffect(() => {
        setIsClient(true);
    }, []);

    // Load planner whenever active month/year changes
    useEffect(() => {
        loadSavedPlanner();
    }, [activeYear, activeMonth]);

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

    const handleActiveStartDateChange = useCallback(({ activeStartDate }) => {
        const newYear = activeStartDate.getFullYear();
        const newMonth = activeStartDate.getMonth() + 1;

        // Only update if month/year actually changed
        if (newYear !== activeYear || newMonth !== activeMonth) {
            setActiveYear(newYear);
            setActiveMonth(newMonth);
        }
    }, [activeYear, activeMonth]);

    const generateFoodPlan = useCallback(async () => {
        let allPlans = [];
        try {
            const savedPlanner = localStorage.getItem('foodPlanner');
            if (savedPlanner) {
                const parsed = JSON.parse(savedPlanner);
                allPlans = Array.isArray(parsed) ? parsed : [parsed];
            }
        } catch (error) {
            console.error('Error parsing existing plans:', error);
            allPlans = [];
        }

        const existingPlanIndex = allPlans.findIndex(plan =>
            plan.year === activeYear && plan.month === activeMonth
        );

        if (existingPlanIndex !== -1) {
            const confirmOverwrite = window.confirm(
                'A meal plan already exists for this month. Overwrite it?'
            );
            if (!confirmOverwrite) return;
        }

        setLoading(true);
        try {
            const response = await fetch(`/api/foodPlan?year=${activeYear}&month=${activeMonth}`);
            const { mealPlan, shoppingLists } = await response.json();

            const newEvents = {};
            Object.entries(mealPlan).forEach(([day, meals]) => {
                const date = new Date(activeYear, activeMonth - 1, day);
                const dateString = date.toISOString().split('T')[0];
                newEvents[dateString] = meals;
            });

            const newPlan = {
                year: activeYear,
                month: activeMonth,
                events: newEvents,
                shoppingLists
            };

            if (existingPlanIndex !== -1) {
                allPlans[existingPlanIndex] = newPlan;
            } else {
                allPlans.push(newPlan);
            }

            localStorage.setItem('foodPlanner', JSON.stringify(allPlans));
            setEvents(newEvents);
            setShoppingLists(shoppingLists);
        } catch (error) {
            console.error('Error generating food plan:', error);
        }
        setLoading(false);
    }, [activeYear, activeMonth]);

    const handleDateChange = useCallback((date) => {
        setSelectedDate(date);
        setSelectedWeek(getWeekNumberForDate(date));
    }, [getWeekNumberForDate]);

    if (!isClient) return null;

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

    // Modified right panel JSX
    const RightPanel = () => (
        <div className="right-panel">

            <button
                onClick={generateFoodPlan}
                disabled={loading}
                className="generate-button"
                >
                {loading ? 'Generating...' : `Generate ${new Date(activeYear, activeMonth - 1).toLocaleString('default', { month: 'long' })} Plan`}
            </button>
            <div className="accordion">
                {/* View Details Accordion */}
                <div className="accordion-item">
                    <div className="accordion-header" onClick={() => setActiveRegister(activeRegister === 2 ? null : 2)}>
                        <h3>View Detail of Food Plan</h3>
                        <span>{activeRegister === 2 ? '−' : '+'}</span>
                    </div>
                    {activeRegister === 2 && (
                        <div className="accordion-content">
                            <div className="shopping-list" ref={shoppingListRef}>
                                <h3>Weekly Shopping List</h3>
                                {selectedWeek ? (
                                    shoppingLists[selectedWeek] ? (
                                        <div className="week">
                                            <h4>Week {selectedWeek}</h4>
                                            <ul>
                                                {shoppingLists[selectedWeek].map((ingredient, index) => (
                                                    <li key={index}>{ingredient}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    ) : (
                                        <p>No shopping list for week {selectedWeek}</p>
                                    )
                                ) : (
                                    Object.entries(shoppingLists).length > 0 ? (
                                        Object.entries(shoppingLists).map(([weekNumber, ingredients]) => (
                                            <div key={weekNumber} className="week">
                                                <h4>Week {weekNumber}</h4>
                                                <ul>
                                                    {ingredients.map((ingredient, index) => (
                                                        <li key={index}>{ingredient}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ))
                                    ) : (
                                        <p>No shopping lists generated yet</p>
                                    )
                                )}
                            </div>
                            {selectedDate && (
                                <div className="day-events">
                                    <h3>Meals for {selectedDate.toDateString()}</h3>
                                    {events[selectedDate.toISOString().split('T')[0]] ? (
                                        <ul>
                                            {events[selectedDate.toISOString().split('T')[0]].map((event, index) => (
                                                <li key={index}>{event}</li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p>No meals planned for this day</p>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Create New Meal Accordion */}
                <div className="accordion-item">
                    <div className="accordion-header" onClick={() => setActiveRegister(activeRegister === 3 ? null : 3)}>
                        <h3>Create New Meal</h3>
                        <span>{activeRegister === 3 ? '−' : '+'}</span>
                    </div>
                    {activeRegister === 3 && (
                        <div className="accordion-content">
                            <div className="meal-form">
                                <input type="text" placeholder="Meal Name" ref={mealNameRef} />
                                <input type="text" placeholder="Ingredients (comma separated)" ref={ingredientsRef} />
                                <button onClick={handleCreateMeal} className="save-button">Save Meal</button>

                            </div>
                        </div>
                    )}
                </div>

                {/* Show All Meals Accordion */}
                <div className="accordion-item">
                    <div className="accordion-header" onClick={() => {
                        setActiveRegister(activeRegister === 4 ? null : 4);
                        fetchAllMeals();
                    }}>
                        <h3>Show All Meals</h3>
                        <span>{activeRegister === 4 ? '−' : '+'}</span>
                    </div>
                    {activeRegister === 4 && (
                        <div className="accordion-content">
                            <div className="all-meals-list">
                                {allMeals.length > 0 ? (
                                    <ul>
                                        {allMeals.map((meal, index) => (
                                            <li key={index}>
                                                {meal}
                                                <button
                                                    onClick={() => handleDeleteMeal(meal)}
                                                    className="delete-button"
                                                    title="Delete meal"
                                                >
                                                    −
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p>No meals available</p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

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
                    onClickMonth={() => {}}
                />
                <RightPanel />
            </div>
        </div>
    );
};

export default MyCalendar;