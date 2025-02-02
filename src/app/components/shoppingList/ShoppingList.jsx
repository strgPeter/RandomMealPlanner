'use client';

import React from 'react';
import './ShoppingList.css'

export const ShoppingList = ({ shoppingLists, selectedWeek }) => {
    if (selectedWeek) {
        return shoppingLists[selectedWeek] ? (
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
        );
    }

    return Object.entries(shoppingLists).length > 0 ? (
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
    );
};