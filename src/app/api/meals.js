import db from "../../database/mealsDB.js";

/**
 * Inserts a meal with its ingredients into the database.
 * If the meal already exists, it will not be added again.
 * The meal and ingredients are linked in the MealIngredients table.
 *
 * @param {string} mealName - The name of the meal.
 * @param {string[]} ingredients - A list of ingredient names.
 * @returns {Object} - An object containing success status and a message.
 */
export async function insertMeal(mealName, ingredients) {
    try {
        // Insert meal if it doesn't exist
        const insertMealStmt = db.prepare(
            "INSERT INTO Meals (meal_name) VALUES (?) ON CONFLICT(meal_name) DO NOTHING"
        );
        insertMealStmt.run(mealName);

        // Get meal_id
        const getMealIdStmt = db.prepare("SELECT meal_id FROM Meals WHERE meal_name = ?");
        const { meal_id } = getMealIdStmt.get(mealName);

        if (!meal_id) {
            return { success: false, message: "Failed to retrieve meal_id" };
        }

        const insertIngredientStmt = db.prepare(
            "INSERT INTO Ingredients (ingredient_name) VALUES (?) ON CONFLICT(ingredient_name) DO NOTHING"
        );
        const getIngredientIdStmt = db.prepare("SELECT ingredient_id FROM Ingredients WHERE ingredient_name = ?");
        const insertMealIngredientStmt = db.prepare(
            "INSERT INTO MealIngredients (meal_id, ingredient_id) VALUES (?, ?) ON CONFLICT DO NOTHING"
        );

        db.transaction(() => {
            for (const ingredient of ingredients) {
                insertIngredientStmt.run(ingredient);
                const { ingredient_id } = getIngredientIdStmt.get(ingredient);
                insertMealIngredientStmt.run(meal_id, ingredient_id);
            }
        })();

        return { success: true, message: "Meal added successfully!" };
    } catch (error) {
        return { success: false, message: error.message };
    }
}


/**
 * Fetches all meals and their ingredients.
 * Returns an object where the keys are meal names, and the values are lists of ingredient names.
 *
 * @returns {Object} - A dictionary of meal names and their ingredient lists.
 */
export function getAllMeals() {
    try {
        const meals = db.prepare("SELECT meal_id, meal_name FROM Meals").all();
        const result = {};

        for (const { meal_id, meal_name } of meals) {
            const ingredients = db
                .prepare(`
                    SELECT Ingredients.ingredient_name 
                    FROM Ingredients 
                    JOIN MealIngredients ON Ingredients.ingredient_id = MealIngredients.ingredient_id 
                    WHERE MealIngredients.meal_id = ?
                `)
                .all(meal_id)
                .map(row => row.ingredient_name);

            result[meal_name] = ingredients;
        }

        return result;
    } catch (error) {
        return { error: error.message };
    }
}


/**
 * Handles API requests for managing meals.
 * - POST: Inserts a new meal with ingredients.
 * - GET: Retrieves all meals with their ingredients.
 *
 * @param {import("next").NextApiRequest} req - The API request object.
 * @param {import("next").NextApiResponse} res - The API response object.
 *
 * Example API calls from the frontend:
 * 
 * **POST (Insert Meal) Example:**
 * ```javascript
 * async function addMeal() {
 *     const response = await fetch("/api/meals", {
 *         method: "POST",
 *         headers: { "Content-Type": "application/json" },
 *         body: JSON.stringify({
 *             mealName: "Pasta",
 *             ingredients: ["Tomato Sauce", "Garlic", "Pasta"]
 *         }),
 *     });
 *
 *     const data = await response.json();
 *     console.log(data);
 * }
 * ```
 *
 * **GET (Fetch All Meals) Example:**
 * ```javascript
 * async function fetchMeals() {
 *     const response = await fetch("/api/meals");
 *     const meals = await response.json();
 *     console.log(meals);
 * }
 * ```
 */
export default function handler(req, res) {
    if (req.method === "POST") {
        const { mealName, ingredients } = req.body;
        const result = insertMeal(mealName, ingredients);
        res.status(200).json(result);
    } else if (req.method === "GET") {
        res.status(200).json(getAllMeals());
    } else {
        res.status(405).json({ error: "Method Not Allowed" });
    }
}