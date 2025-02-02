import {getAllMeals} from "../dbHandler";
import {deleteMeal} from "../dbHandler";
import {NextResponse} from "next/server.js";

export async function GET() {
    const allMealName = Object.keys(getAllMeals());
    return NextResponse.json(allMealName);
}

export async function DELETE(request) {
    const { searchParams } = new URL(request.url);
    const mealName = searchParams.get('mealName');

    if (!mealName) {
        return NextResponse.json(
            { success: false, message: "An error with delete occurred" },
            { status: 400 }
        );
    }
    const result = deleteMeal(mealName);
    return NextResponse.json(result);
}