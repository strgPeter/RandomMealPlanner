'use client';

import React from 'react';
import './DayEvents.css'

export const DayEvents = ({ selectedDate, events }) => {
    const dateString = selectedDate.toISOString().split('T')[0];
    const dayEvents = events[dateString];

    return (
        <div className="day-events">
            <h3>Meals for {selectedDate.toDateString()}</h3>
            {dayEvents ? (
                <ul>
                    {dayEvents.map((event, index) => (
                        <li key={index}>{event}</li>
                    ))}
                </ul>
            ) : (
                <p>No meals planned for this day</p>
            )}
        </div>
    );
};