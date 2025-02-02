'use client';

import React from 'react';
import "./AccordionItem.css";

export const AccordionItem = ({ title, activeRegister, registerNumber, children, onToggle }) => {
    const isActive = activeRegister === registerNumber;

    return (
        <div className="accordion-item">
            <div className="accordion-header" onClick={() => onToggle(isActive ? null : registerNumber)}>
                <h3>{title}</h3>
                <span>{isActive ? '−' : '+'}</span>
            </div>
            {isActive && (
                <div className="accordion-content">
                    {children}
                </div>
            )}
        </div>
    );
};
