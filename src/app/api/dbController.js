import {getAllMeals} from "./dbHandler";

/**
 * Generates a meal plan for a given month and a shopping list for each week.
 * Ensures no consecutive days have the same meal and no two meals per day are the same.
 *
 * @param {number} year - The year for the meal plan.
 * @param {number} month - The month (1-12) for which to generate the meal plan.
 * @returns {Object} - An object containing the meal plan and weekly shopping lists.
 */
export function generateMealPlan(year, month) {
    const meals = getAllMeals();
    const mealNames = Object.keys(meals);

    if (mealNames.length < 2) {
        throw new Error("Not enough unique meals available.");
    }

    const daysInMonth = new Date(year, month, 0).getDate();
    const firstDayOfMonth = new Date(year, month - 1, 1).getDay(); // 0 = Sunday, 1 = Monday, etc.

    let mealPlan = {};
    let recentMeals = [];
    let shoppingLists = {};
    let currentWeek = 0;

    const addToShoppingList = (week, meal) => {
        if (!shoppingLists[week]) {
            shoppingLists[week] = new Set();
        }
        meals[meal].forEach(ingredient => shoppingLists[week].add(ingredient));
    };

    for (let day = 1; day <= daysInMonth; day++) {
        const lastThree = recentMeals.slice(-3);
        let availableMeals = mealNames.filter(meal => !lastThree.includes(meal));

        if (availableMeals.length < 2) {
            throw new Error(`Not enough meals available for day ${day}.`);
        }

        let dayMeals = [];

        const firstMealIndex = Math.floor(Math.random() * availableMeals.length);
        const firstMeal = availableMeals.splice(firstMealIndex, 1)[0];
        dayMeals.push(firstMeal);

        const secondMealIndex = Math.floor(Math.random() * availableMeals.length);
        const secondMeal = availableMeals.splice(secondMealIndex, 1)[0];
        dayMeals.push(secondMeal);

        mealPlan[day] = dayMeals;
        recentMeals.push(...dayMeals);

        // Determine the current week (Monday-Sunday)
        let weekday = (firstDayOfMonth + day - 1) % 7; // 0 = Sunday, 1 = Monday, etc.
        if (weekday === 1 || day === 1) {
            currentWeek++; // New week starts on Monday or the first day of the month
        }

        // Add ingredients to the weekly shopping list
        addToShoppingList(currentWeek, firstMeal);
        addToShoppingList(currentWeek, secondMeal);
    }

    // Convert ingredient Sets to arrays
    for (let week in shoppingLists) {
        shoppingLists[week] = Array.from(shoppingLists[week]);
    }

    return { mealPlan, shoppingLists };
}