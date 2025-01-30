import { getAllMeals } from "../meals.js";
import { insertMeal } from "../meals.js";
import {NextResponse} from "next/server";

/**
 * Generates a meal plan for a given month.
 * Ensures that no two consecutive days have the same meal and no two meals per day are the same.
 *
 * @param {number} year - The year for the meal plan.
 * @param {number} month - The month (1-12) for which to generate the meal plan.
 * @returns {Object} - A dictionary mapping each day to two unique meals.
 */
export function generateMealPlan(year, month) {
    const meals = Object.keys(getAllMeals()); // Fetch meal names
    if (meals.length < 2) {
        throw new Error("Not enough unique meals available.");
    }

    const daysInMonth = new Date(year, month, 0).getDate();
    let mealPlan = {};
    let recentMeals = [];

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
    }

    return mealPlan;
}

/**
 * API handler to fetch meal plan based on month and year.
 *
 */
/*export default function handler(req, res) {
    if (req.method === "GET") {
        const { year, month } = req.query;
        if (!year || !month) {
            return res.status(400).json({ error: "Year and month parameters are required." });
        }

        try {
            const mealPlan = generateMealPlan(parseInt(year), parseInt(month));
            res.status(200).json(mealPlan);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    } else {
        res.status(405).json({ error: "Method Not Allowed" });
    }
}*/

export async function GET() {
    return NextResponse.json(generateMealPlan(2025,1));
}

export async function POST(req) {
    const { mealName, ingredients } = req.body;
    
    if (!mealName || !Array.isArray(ingredients) || ingredients.length === 0) {
        return NextResponse.json({ success: false, message: "Invalid input data" });
    }
    
    const result = insertMeal(mealName, ingredients);
    return NextResponse.json(result);
}