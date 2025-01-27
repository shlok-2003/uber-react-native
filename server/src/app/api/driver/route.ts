import { neon } from "@neondatabase/serverless";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const sql = neon(`${process.env.DATABASE_URL}`);
        const response = await sql`SELECT * FROM drivers`;

        return NextResponse.json({
            success: true,
            message: "Driver fetched successfully",
            data: response,
        });
    } catch (error) {
        console.error("Error fetching driver", error);
        return NextResponse.json(
            { success: false, error: "Internal Server Error" },
            { status: 500 },
        );
    }
}

