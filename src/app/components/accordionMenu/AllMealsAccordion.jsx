'use client';

import React from 'react';
import './AllMealAccordion.css'

export const AllMealsAccordion = ({ allMeals, onDeleteMeal }) => (
    <div className="all-meals-list">
        {allMeals.length > 0 ? (
            <ul>
                {allMeals.map((meal, index) => (
                    <li key={index}>
                        {meal}
                        <button
                            onClick={() => onDeleteMeal(meal)}
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
);