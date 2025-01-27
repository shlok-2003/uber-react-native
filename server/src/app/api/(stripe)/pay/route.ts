import { NextRequest, NextResponse } from "next/server";
import { Stripe } from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: NextRequest) {
    try {
        const { payment_method_id, payment_intent_id, customer_id } =
            await request.json();

        if (!payment_method_id || !payment_intent_id || !customer_id) {
            return NextResponse.json(
                { success: false, error: "Missing required fields" },
                { status: 400 },
            );
        }

        const paymentMethod = await stripe.paymentMethods.attach(
            payment_method_id,
            { customer: customer_id },
        );

        const result = await stripe.paymentIntents.confirm(payment_intent_id, {
            payment_method: paymentMethod.id,
        });

        return NextResponse.json({
            success: true,
            message: "Payment successful",
            result: result,
        });
    } catch (error) {
        console.error("Error processing payment", error);
        return NextResponse.json(
            { success: false, error: "Internal Server Error" },
            { status: 500 },
        );
    }
}
