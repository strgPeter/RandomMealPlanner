import * as meals from "./meals.js";

function testInsertAndDeleteMeal() {
  const mealName = "Test Meal";
  const ingredients = ["Tomato", "Cheese", "Basil"];

  // Insert the meal
  console.log("Inserting meal...");
  const insertResult = meals.insertMeal(mealName, ingredients);
  console.log("Insert Result:", insertResult);

  // Display meals after insertion
  console.log("Meals after insertion:");
  console.log(meals.getAllMeals());

  // Delete the meal
  console.log("Deleting meal...");
  const deleteResult = meals.deleteMeal(mealName);
  console.log("Delete Result:", deleteResult);

  // Display meals after deletion
  console.log("Meals after deletion:");
  console.log(meals.getAllMeals());
}

testInsertAndDeleteMeal();
