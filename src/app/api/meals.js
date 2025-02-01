import db from "../../database/mealsDB.js";

/**
 * Inserts a meal with its ingredients into the database.
 *
 * @param {string} mealName - The name of the meal.
 * @param {string[]} ingredients - A list of ingredient names.
 * @returns {Object} - An object containing success status and a message.
 */
export function insertMeal(mealName, ingredients) {
    try {
        // Insert meal if it doesn't exist
        const insertMealStmt = db.prepare(
            "INSERT INTO Meals (meal_name) VALUES (?) ON CONFLICT(meal_name) DO NOTHING"
        );
        insertMealStmt.run(mealName);

        // Get meal_id
        const getMealIdStmt = db.prepare("SELECT meal_id FROM Meals WHERE meal_name = ?");
        const mealRow = getMealIdStmt.get(mealName);

        if (!mealRow) {
            return { success: false, message: "Failed to retrieve meal_id" };
        }

        const meal_id = mealRow.meal_id;

        const insertIngredientStmt = db.prepare(
            "INSERT INTO Ingredients (ingredient_name) VALUES (?) ON CONFLICT(ingredient_name) DO NOTHING"
        );
        const getIngredientIdStmt = db.prepare("SELECT ingredient_id FROM Ingredients WHERE ingredient_name = ?");
        const insertMealIngredientStmt = db.prepare(
            "INSERT OR IGNORE INTO MealIngredients (meal_id, ingredient_id) VALUES (?, ?)"
        );

        const insertTransaction = db.transaction(() => {
            for (const ingredient of ingredients) {
                insertIngredientStmt.run(ingredient);
                const ingredientRow = getIngredientIdStmt.get(ingredient);

                if (ingredientRow) {
                    insertMealIngredientStmt.run(meal_id, ingredientRow.ingredient_id);
                }
            }
        });

        insertTransaction();

        return { success: true, message: "Meal added successfully!" };
    } catch (error) {
        return { success: false, message: error.message };
    }
}

/**
 * Fetches all meals and their ingredients.
 * 
 * Example:
 *      const response = await fetch("/api/meals");
 *      const meals = await response.json();
 *      console.log("Meals Data:", meals);
 *
 * @returns {Object} - A dictionary of meal names and their ingredient lists.
 */
export function getAllMeals() {
    try {
        const meals = db.prepare("SELECT meal_id, meal_name FROM Meals").all();
        const result = {};

        const getIngredientsStmt = db.prepare(`
            SELECT Ingredients.ingredient_name 
            FROM Ingredients 
            JOIN MealIngredients ON Ingredients.ingredient_id = MealIngredients.ingredient_id 
            WHERE MealIngredients.meal_id = ?
        `);

        for (const { meal_id, meal_name } of meals) {
            const ingredients = getIngredientsStmt.all(meal_id).map(row => row.ingredient_name);
            result[meal_name] = ingredients;
        }

        return result;
    } catch (error) {
        return { error: error.message };
    }
}
