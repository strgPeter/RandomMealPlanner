import {getAllMeals} from "../meals";
import {NextResponse} from "next/server.js";

export async function GET() {
    const allMealName = Object.keys(getAllMeals());
    return NextResponse.json(allMealName);
}