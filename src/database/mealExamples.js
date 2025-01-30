/**
 * Run with 
 * node .\src\database\mealExamples.js
 */

import { insertMeal } from '../app/api/meals.js';


// Example meals with ingredients
const exampleMeals = [
  // Italian
  { name: "Spaghetti Carbonara", ingredients: ["Spaghetti", "Eggs", "Pancetta", "Parmesan", "Black Pepper"] },
  { name: "Margherita Pizza", ingredients: ["Pizza Dough", "Tomato Sauce", "Fresh Mozzarella", "Basil", "Olive Oil"] },
  { name: "Lasagna", ingredients: ["Lasagna Noodles", "Ground Beef", "Ricotta", "Mozzarella", "Tomato Sauce"] },
  
  // Mexican
  { name: "Chicken Tacos", ingredients: ["Chicken Breast", "Tortillas", "Lime", "Cilantro", "Onion"] },
  { name: "Guacamole", ingredients: ["Avocado", "Lime", "Tomato", "Onion", "Cilantro"] },
  { name: "Chili Con Carne", ingredients: ["Ground Beef", "Kidney Beans", "Tomatoes", "Chili Powder", "Onion"] },
  
  // Asian
  { name: "Chicken Stir-Fry", ingredients: ["Chicken Breast", "Broccoli", "Soy Sauce", "Garlic", "Ginger"] },
  { name: "Vegetable Sushi", ingredients: ["Sushi Rice", "Nori", "Cucumber", "Avocado", "Carrot"] },
  { name: "Beef Pho", ingredients: ["Beef Broth", "Rice Noodles", "Beef Sirloin", "Bean Sprouts", "Basil"] },
  
  // Breakfast
  { name: "Pancakes", ingredients: ["Flour", "Milk", "Eggs", "Baking Powder", "Butter"] },
  { name: "Omelette", ingredients: ["Eggs", "Cheese", "Mushrooms", "Bell Pepper", "Onion"] },
  { name: "Avocado Toast", ingredients: ["Bread", "Avocado", "Lemon", "Chili Flakes", "Olive Oil"] },
  
  // Vegetarian
  { name: "Vegetable Curry", ingredients: ["Coconut Milk", "Curry Powder", "Potato", "Carrot", "Cauliflower"] },
  { name: "Quinoa Salad", ingredients: ["Quinoa", "Cherry Tomatoes", "Cucumber", "Feta", "Olive Oil"] },
  { name: "Stuffed Peppers", ingredients: ["Bell Peppers", "Rice", "Black Beans", "Corn", "Cheese"] },
  
  // Seafood
  { name: "Grilled Salmon", ingredients: ["Salmon Fillet", "Lemon", "Dill", "Olive Oil", "Garlic"] },
  { name: "Shrimp Scampi", ingredients: ["Shrimp", "Linguine", "Garlic", "White Wine", "Butter"] },
  { name: "Fish Tacos", ingredients: ["White Fish", "Tortillas", "Cabbage", "Lime", "Cilantro"] },
  
  // Comfort Food
  { name: "Mac & Cheese", ingredients: ["Macaroni", "Cheddar", "Milk", "Butter", "Flour"] },
  { name: "Chicken Pot Pie", ingredients: ["Chicken", "Pie Crust", "Carrots", "Peas", "Onion"] },
  { name: "Beef Stew", ingredients: ["Beef Chuck", "Potatoes", "Carrots", "Onion", "Beef Broth"] },
  
  // Healthy
  { name: "Greek Salad", ingredients: ["Cucumber", "Tomato", "Red Onion", "Feta", "Olives"] },
  { name: "Grilled Chicken Salad", ingredients: ["Chicken Breast", "Mixed Greens", "Tomato", "Cucumber", "Balsamic"] },
  { name: "Smoothie Bowl", ingredients: ["Frozen Berries", "Banana", "Almond Milk", "Granola", "Chia Seeds"] },
  
  // Desserts
  { name: "Chocolate Cake", ingredients: ["Flour", "Sugar", "Cocoa Powder", "Eggs", "Butter"] },
  { name: "Tiramisu", ingredients: ["Ladyfingers", "Mascarpone", "Coffee", "Eggs", "Cocoa Powder"] },
  { name: "Apple Pie", ingredients: ["Apples", "Pie Crust", "Sugar", "Cinnamon", "Butter"] },
  
  // Quick Meals
  { name: "BLT Sandwich", ingredients: ["Bread", "Bacon", "Lettuce", "Tomato", "Mayonnaise"] },
  { name: "Quesadilla", ingredients: ["Tortilla", "Cheese", "Chicken", "Salsa", "Sour Cream"] },
  { name: "Ramen", ingredients: ["Ramen Noodles", "Egg", "Green Onion", "Pork Belly", "Soy Sauce"] }
];

async function insertData() {
    for (const meal of exampleMeals) {
      const result = await insertMeal(meal.name, meal.ingredients);
      console.log(result.message);
    }
    console.log("Database seeded successfully!");
  }
  
insertData();