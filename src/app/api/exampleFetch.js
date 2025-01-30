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

// Example test run
testGenerateMealPlan(2025, 2); // Generate and print meal plan for February 2025
