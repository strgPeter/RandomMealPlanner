import { getAllMeals } from "../meals.js";
import { insertMeal } from "../meals.js";
import {NextResponse} from "next/server.js";

/**
 * Generates a meal plan for a given month and a shopping list for each week.
 * Ensures no consecutive days have the same meal and no two meals per day are the same.
 *
 * @param {number} year - The year for the meal plan.
 * @param {number} month - The month (1-12) for which to generate the meal plan.
 * @returns {Object} - An object containing the meal plan and weekly shopping lists.
 */
export function generateMealPlan(year, month) {
    const meals = Object.keys(getAllMeals()); // Fetch meal names
    const mealIngredients = getAllMeals(); // Fetch meals with ingredients
    
    if (meals.length < 2) {
        throw new Error("Not enough unique meals available.");
    }

    const daysInMonth = new Date(year, month, 0).getDate();
    const firstDayOfMonth = new Date(year, month - 1, 1).getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    let mealPlan = {};
    let recentMeals = [];
    let shoppingLists = {};
    let currentWeek = 0;
    
    // Helper function to add ingredients to a weekly shopping list
    const addToShoppingList = (week, meal) => {
        if (!shoppingLists[week]) {
            shoppingLists[week] = new Set();
        }
        mealIngredients[meal].forEach(ingredient => shoppingLists[week].add(ingredient));
    };

    for (let day = 1; day <= daysInMonth; day++) {
        const lastThree = recentMeals.slice(-3);
        let availableMeals = meals.filter(meal => !lastThree.includes(meal));

        if (availableMeals.length < 2) {
            throw new Error(`Not enough meals available for day ${day}.`);
        }

        let dayMeals = [];
        
        // Select first meal
        const firstMealIndex = Math.floor(Math.random() * availableMeals.length);
        const firstMeal = availableMeals.splice(firstMealIndex, 1)[0];
        dayMeals.push(firstMeal);

        // Select second meal
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


export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const year = parseInt(searchParams.get('year')) || new Date().getFullYear();
    const month = parseInt(searchParams.get('month')) || new Date().getMonth() + 1;

    return NextResponse.json(generateMealPlan(year, month));
}

export async function POST(req) {
    try {
        const body = await req.json();  // Extract JSON body correctly
        const { mealName, ingredients } = body;

        if (!mealName || !Array.isArray(ingredients) || ingredients.length === 0) {
            return NextResponse.json({ success: false, message: "Invalid input data" });
        }

        const result = insertMeal(mealName, ingredients);
        return NextResponse.json(result);
    } catch (error) {
        console.error("Error in POST request:", error);
        return NextResponse.json({ success: false, message: "Server error" });
    }
}
