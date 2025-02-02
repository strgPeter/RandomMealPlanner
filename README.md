# Meal Planner

## Overview
Meal Planner is a meal planning calendar application that randomly assigns meals to each day of the month while ensuring no meal is repeated on consecutive days. The meals are stored in an SQLite database, and the app generates a weekly shopping list containing all necessary ingredients for that week.

### Screenshot
![Initial view](./Screenshot%202025-02-02%20215343.png)

## Installation & Setup

### Prerequisites
- Node.js and npm installed

### Steps to Run the Project
1. Clone the repository:
   ```sh
   git clone https://github.com/strgPeter/RandomMealPlanner.git
   cd random_meal_planner
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the server:
   ```sh
   npm run build
   npm start
   ```
   or start the development server:
   ```sh
   npm run dev
   ```

   The application should now be running at `http://localhost:3000/`.

## Usage
- The food plan for the current month can be regenerated at any time with the 'Generate <Month> Plan' button.
- In the accordion menu on the left-hand side, the weekly shopping list(s) can be found by clicking the 'View Detail of Food Plan' button.
   - When selecting a specific day on the calendar, the shopping list is limited to that week.
- Meals can be added to the system with the 'Create New Meal' button. The ingredients must be listed, separated by commas.
- To meet certain constraints when distributing meals over the week, at least five meals must be defined.
- This repository comes with a number of predefined meals for demonstration purposes; meals can be deleted by clicking on the red minus symbol next to the meal after clicking 'Show All Meals'.
- Additionally, the plan can be deleted by clicking the 'Delete <Month> Plan' button. This does not delete the specified meals from the system.

