import { neon } from "@neondatabase/serverless";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {
            origin_address,
            destination_address,
            origin_latitude,
            origin_longitude,
            destination_latitude,
            destination_longitude,
            ride_time,
            fare_price,
            payment_status,
            driver_id,
            user_id,
        } = body;

        if (
            !origin_address ||
            !destination_address ||
            !origin_latitude ||
            !origin_longitude ||
            !destination_latitude ||
            !destination_longitude ||
            !ride_time ||
            !fare_price ||
            !payment_status ||
            !driver_id ||
            !user_id
        ) {
            return Response.json(
                { error: "Missing required fields" },
                { status: 400 },
            );
        }

        const sql = neon(`${process.env.DATABASE_URL}`);

        const response = await sql`
            INSERT INTO rides ( 
                origin_address, 
                destination_address, 
                origin_latitude, 
                origin_longitude, 
                destination_latitude, 
                destination_longitude, 
                ride_time, 
                fare_price, 
                payment_status, 
                driver_id, 
                user_id
            ) VALUES (
                ${origin_address},
                ${destination_address},
                ${origin_latitude},
                ${origin_longitude},
                ${destination_latitude},
                ${destination_longitude},
                ${ride_time},
                ${fare_price},
                ${payment_status},
                ${driver_id},
                ${user_id}
            )
            RETURNING *;
        `;

        return NextResponse.json({
            success: true,
            message: "Ride created successfully",
            data: response[0],
        });
    } catch (error) {
        console.error("Error fetching ride", error);
        return NextResponse.json(
            { success: false, error: "Internal Server Error" },
            { status: 500 },
        );
    }
}
