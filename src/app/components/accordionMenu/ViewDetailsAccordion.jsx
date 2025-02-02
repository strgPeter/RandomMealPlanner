'use client';

import React from 'react';
import { ShoppingList } from '../shoppingList/ShoppingList';
import { DayEvents } from '../events/DayEvents';

export const ViewDetailsAccordion = ({ shoppingLists, selectedWeek, selectedDate, events }) => (
    <>
        <div className="shopping-list">
            <h3>Weekly Shopping List</h3>
            <ShoppingList shoppingLists={shoppingLists} selectedWeek={selectedWeek} />
        </div>
        {selectedDate && <DayEvents selectedDate={selectedDate} events={events} />}
    </>
);