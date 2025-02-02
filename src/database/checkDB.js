import db from "./mealsDB.js";

async function logDatabaseStats() {
    const mealCount = db.prepare("SELECT COUNT(*) AS count FROM Meals").get().count;
    const ingredientCount = db.prepare("SELECT COUNT(*) AS count FROM Ingredients").get().count;
    const mealIngredientCount = db.prepare("SELECT COUNT(*) AS count FROM MealIngredients").get().count;
  
    console.log(`Meals: ${mealCount}, Ingredients: ${ingredientCount}, Meal-Ingredient Links: ${mealIngredientCount}`);
}

/*function deleteAllTables() {
    try {
        db.exec("DROP TABLE IF EXISTS MealIngredients;");
        db.exec("DROP TABLE IF EXISTS Ingredients;");
        db.exec("DROP TABLE IF EXISTS Meals;");
        console.log("All tables deleted successfully.");
    } catch (error) {
        console.error("Error deleting tables:", error);
    }
}*/
logDatabaseStats();
  