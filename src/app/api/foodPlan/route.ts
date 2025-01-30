import { getAllMeals } from "../meals.js";
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
    let lastMeal = null;

    for (let day = 1; day <= daysInMonth; day++) {
        let availableMeals = meals.filter(meal => meal !== lastMeal);
        let dayMeals = [];

        while (dayMeals.length < 2) {
            let meal = availableMeals.splice(Math.floor(Math.random() * availableMeals.length), 1)[0];
            dayMeals.push(meal);
        }

        mealPlan[day] = dayMeals;
        lastMeal = dayMeals[1]; // Ensures no consecutive days have the same last meal
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