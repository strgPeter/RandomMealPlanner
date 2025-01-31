'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './Calendar.css';

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

    // Scroll effect
    useEffect(() => {
        if (shoppingListRef.current) {
            shoppingListRef.current.scrollTop = 0;
        }
    }, [selectedWeek]);

    // Initial load effect
    useEffect(() => {
        setIsClient(true);
        loadSavedPlanner();
    }, []);

    const loadSavedPlanner = useCallback(() => {
        const savedPlanner = localStorage.getItem('foodPlanner');
        if (savedPlanner) {
            const { year, month, events: savedEvents = {}, shoppingLists: savedLists = {} } = JSON.parse(savedPlanner);
            if (year === activeYear && month === activeMonth) {
                setEvents(prev => JSON.stringify(prev) === JSON.stringify(savedEvents) ? prev : savedEvents);
                setShoppingLists(prev => JSON.stringify(prev) === JSON.stringify(savedLists) ? prev : savedLists);
            }
        }
    }, [activeYear, activeMonth]);

    const handleActiveStartDateChange = useCallback(({ activeStartDate }) => {
        const newYear = activeStartDate.getFullYear();
        const newMonth = activeStartDate.getMonth() + 1;

        if (newYear !== activeYear || newMonth !== activeMonth) {
            setActiveYear(newYear);
            setActiveMonth(newMonth);
            // Queue the planner load after state update
            setTimeout(loadSavedPlanner, 0);
        }
    }, [activeYear, activeMonth, loadSavedPlanner]);

    const generateFoodPlan = useCallback(async () => {
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

            setEvents(newEvents);
            setShoppingLists(shoppingLists);
            localStorage.setItem('foodPlanner', JSON.stringify({
                year: activeYear,
                month: activeMonth,
                events: newEvents,
                shoppingLists
            }));
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
                />

                <div className="right-panel">
                    <button
                        onClick={generateFoodPlan}
                        disabled={loading}
                        className="generate-button"
                    >
                        {loading ? 'Generating...' : `Generate ${new Date(activeYear, activeMonth - 1).toLocaleString('default', { month: 'long' })} Plan`}
                    </button>

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
            </div>
        </div>
    );
};

export default MyCalendar;