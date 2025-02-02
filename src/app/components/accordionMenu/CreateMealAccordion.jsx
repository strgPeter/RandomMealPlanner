'use client';

import React, { useRef } from 'react';
import './CreateMealAccordion.css'

export const CreateMealAccordion = ({ onCreateMeal }) => {
    const mealNameRef = useRef(null);
    const ingredientsRef = useRef(null);

    const handleSubmit = () => {
        onCreateMeal({
            mealName: mealNameRef.current.value.trim(),
            ingredients: ingredientsRef.current.value.trim()
        });
        mealNameRef.current.value = '';
        ingredientsRef.current.value = '';
    };

    return (
        <div className="meal-form">
            <input type="text" placeholder="Meal Name" ref={mealNameRef} />
            <input type="text" placeholder="Ingredients (comma separated)" ref={ingredientsRef} />
            <button onClick={handleSubmit} className="save-button">
                Save Meal
            </button>
        </div>
    );
};