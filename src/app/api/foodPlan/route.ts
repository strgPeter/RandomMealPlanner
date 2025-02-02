import {insertMeal} from "../dbHandler.js";
import {generateMealPlan} from "../dbController";
import {NextResponse} from "next/server.js";


export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const year = parseInt(searchParams.get('year')) || new Date().getFullYear();
    const month = parseInt(searchParams.get('month')) || new Date().getMonth() + 1;

    return NextResponse.json(generateMealPlan(year, month));
}

export async function POST(req) {
    try {
        const body = await req.json();
        const { mealName, ingredients } = body;

        if (!mealName || !Array.isArray(ingredients) || ingredients.length === 0) {
            return NextResponse.json({ success: false, message: "Invalid input data" });
        }

        const result = insertMeal(mealName, ingredients);
        return NextResponse.json(result);
    } catch (error) {
        console.error("Error in POST request:", error);
        return NextResponse.json({ success: false, message: "Server error" });
    }
}
