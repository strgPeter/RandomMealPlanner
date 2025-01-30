import db from "./mealsDB.js";

async function logDatabaseStats() {
    const mealCount = db.prepare("SELECT COUNT(*) AS count FROM Meals").get().count;
    const ingredientCount = db.prepare("SELECT COUNT(*) AS count FROM Ingredients").get().count;
    const mealIngredientCount = db.prepare("SELECT COUNT(*) AS count FROM MealIngredients").get().count;
  
    console.log(`Meals: ${mealCount}, Ingredients: ${ingredientCount}, Meal-Ingredient Links: ${mealIngredientCount}`);
}
  
logDatabaseStats();
  