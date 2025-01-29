'use client';

import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './Calendar.css';

const MyCalendar = () => {
    const [date, setDate] = useState(null);
    const [events, setEvents] = useState({});
    const [isClient, setIsClient] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selectedDay, setSelectedDay] = useState(null);

    useEffect(() => {
        setIsClient(true);
        setDate(new Date());
        const savedEvents = localStorage.getItem('foodPlanner');
        if (savedEvents) {
            setEvents(JSON.parse(savedEvents));
        }
    }, []);

    const generateFoodPlan = async () => {
        setLoading(true);
        try {
            const response = await fetch(null);
            const data = await response.json();

            const newEvents = {};
            const today = new Date();

            data.meals.forEach(meal => {
                const randomDate = new Date(today);
                randomDate.setDate(today.getDate() + Math.floor(Math.random() * 30));
                const dateString = randomDate.toISOString().split('T')[0];

                if (!newEvents[dateString]) {
                    newEvents[dateString] = [];
                }
                newEvents[dateString].push(meal.strMeal);
            });

            setEvents(newEvents);
            localStorage.setItem('foodPlanner', JSON.stringify(newEvents));
        } catch (error) {
            console.error('Error generating food plan:', error);
        }
        setLoading(false);
    };

    const handleDayClick = (value) => {
        setSelectedDay(value);
    };

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
                    onChange={setDate}
                    onClickDay={handleDayClick}
                    value={date}
                    tileContent={tileContent}
                    className="react-calendar"
                />

                <div className="right-panel">
                    <button
                        onClick={generateFoodPlan}
                        disabled={loading}
                        className="generate-button"
                    >
                        {loading ? 'Generating...' : 'Generate Food Planner'}
                    </button>

                    {selectedDay && (
                        <div className="day-events">
                            <h3>Meals for {selectedDay.toDateString()}</h3>
                            {events[selectedDay.toISOString().split('T')[0]] ? (
                                <ul>
                                    {events[selectedDay.toISOString().split('T')[0]].map((event, index) => (
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