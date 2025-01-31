import { generateMealPlan } from "./route.ts";

const testYear = 2025;
const testMonth = 2;


const result = generateMealPlan(testYear, testMonth);

console.log(result);