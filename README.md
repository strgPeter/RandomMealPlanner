# Meal Planner

## Overview
Meal Planner is a meal planning calendar application that randomly assigns meals to each day of the month while ensuring no meal is repeated on consecutive days. The meals are stored in an SQLite database, and the app generates a weekly shopping list containing all necessary ingredients for that week.


## Installation & Setup

### Prerequisites
- Node.js and npm installed

### Steps to Run the Project
1. Clone the repository:
   ```sh
   git clone https://github.com/strgPeter/RandomMealPlanner.git
   cd react-food-calendar
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the development server:
   ```sh
   npm start
   ```
   The application should now be running at `http://localhost:3000/`.


## Usage
1. Open the app in your browser.
2. Click on 'Generate [Month] Plan.
3. View the generated meal plan for the month.
4. Check the shopping list for each week.
5. Clicking on a day limits the shopping list to the corresponding week.


