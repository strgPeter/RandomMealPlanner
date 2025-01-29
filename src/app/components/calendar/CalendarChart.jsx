'use client';

import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './Calendar.css';

// Sample events (for demonstration purposes)
const sampleEvents = {
    '2025-01-25': ['Meeting with John', 'Doctor Appointment'],
    '2025-01-28': ['Team meeting', 'Project deadline'],
    '2025-02-02': ['Birthday Party'],
};

const MyCalendar = () => {
    const [date, setDate] = useState(null); // Start with null
    const [events, setEvents] = useState(sampleEvents);
    const [isClient, setIsClient] = useState(false); // State to track client-side rendering

    useEffect(() => {
        setIsClient(true); // Only set this flag on the client-side
        setDate(new Date()); // Set the date after the component mounts
    }, []);

    if (!isClient) {
        return null; // Render nothing on the server
    }

    const onChange = (date) => {
        setDate(date);
    };

    // Custom tile content for each day
    const tileContent = ({ date, view }) => {
        const dateString = date.toISOString().split('T')[0]; // YYYY-MM-DD format
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
            <Calendar
                onChange={onChange}
                value={date}
                tileContent={tileContent}
                className="react-calendar"
            />
            <div>
                <p>Selected Date: {date.toDateString()}</p>
                <p>
                    {events[date.toISOString().split('T')[0]]
                        ? events[date.toISOString().split('T')[0]].join(', ')
                        : 'No events for this day.'}
                </p>
            </div>
        </div>
    );
};

export default MyCalendar;
