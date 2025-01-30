import { generateMealPlan } from "./getRandomMeals.js"; // Adjust path if needed

// Function to test meal plan generation
function testGenerateMealPlan(year, month) {
    try {
        const mealPlan = generateMealPlan(year, month);
        console.log("Generated Meal Plan for", month, year, ":\n", mealPlan);
    } catch (error) {
        console.error("Error generating meal plan:", error.message);
    }
}

// fetchMealPlan.js

async function fetchMealPlan(year, month) {
    try {
        const response = await fetch(`/api/getRandomMeals?year=${year}&month=${month}`);
        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
        const data = await response.json();
        console.log("Meal Plan for", month, year, ":", data);
    } catch (error) {
        console.error("Failed to fetch meal plan:", error.message);
    }
}

// Example usage
fetchMealPlan(2025, 2); // Fetch meal plan for February 2025


// Example test run
//testGenerateMealPlan(2025, 2); // Generate and print meal plan for February 2025
