import Database from "better-sqlite3";

const db = new Database("meals.db", { verbose: console.log });

// Create Meals table
db.exec(`
    CREATE TABLE IF NOT EXISTS Meals (
        meal_id INTEGER PRIMARY KEY AUTOINCREMENT,
        meal_name TEXT UNIQUE NOT NULL,
        description TEXT
    );
`);

db.exec(`
    CREATE TABLE IF NOT EXISTS Ingredients (
        ingredient_id INTEGER PRIMARY KEY AUTOINCREMENT,
        ingredient_name TEXT UNIQUE NOT NULL
    );
`);

db.exec(`
    CREATE TABLE IF NOT EXISTS MealIngredients (
        meal_id INTEGER,
        ingredient_id INTEGER,
        PRIMARY KEY (meal_id, ingredient_id),
        FOREIGN KEY (meal_id) REFERENCES Meals(meal_id) ON DELETE CASCADE,
        FOREIGN KEY (ingredient_id) REFERENCES Ingredients(ingredient_id) ON DELETE CASCADE
    );
`);

export default db;
