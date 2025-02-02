'use client';

import React from 'react';
import './RightPanel.css'
import { AccordionItem } from '../accordionMenu/AccordionItem';
import { ViewDetailsAccordion } from '../accordionMenu/ViewDetailsAccordion';
import { CreateMealAccordion } from '../accordionMenu/CreateMealAccordion';
import { AllMealsAccordion } from '../accordionMenu/AllMealsAccordion';

export const RightPanel = ({
                               activeYear,
                               activeMonth,
                               activeRegister,
                               setActiveRegister,
                               generateFoodPlan,
                               loading,
                               shoppingLists,
                               selectedWeek,
                               selectedDate,
                               events,
                               handleCreateMeal,
                               allMeals,
                               handleDeleteMeal,
                               fetchAllMeals
                           }) => (
    <div className="right-panel">
        <button
            onClick={generateFoodPlan}
            disabled={loading}
            className="generate-button"
        >
            {loading ? 'Generating...' : `Generate ${new Date(activeYear, activeMonth - 1).toLocaleString('default', { month: 'long' })} Plan`}
        </button>
        <div className="accordion">
            <AccordionItem
                title="View Detail of Food Plan"
                activeRegister={activeRegister}
                registerNumber={2}
                onToggle={setActiveRegister}
            >
                <ViewDetailsAccordion
                    shoppingLists={shoppingLists}
                    selectedWeek={selectedWeek}
                    selectedDate={selectedDate}
                    events={events}
                />
            </AccordionItem>

            <AccordionItem
                title="Create New Meal"
                activeRegister={activeRegister}
                registerNumber={3}
                onToggle={setActiveRegister}
            >
                <CreateMealAccordion onCreateMeal={handleCreateMeal} />
            </AccordionItem>

            <AccordionItem
                title="Show All Meals"
                activeRegister={activeRegister}
                registerNumber={4}
                onToggle={(reg) => {
                    setActiveRegister(reg);
                    fetchAllMeals();
                }}
            >
                <AllMealsAccordion
                    allMeals={allMeals}
                    onDeleteMeal={handleDeleteMeal}
                />
            </AccordionItem>
        </div>
    </div>
);