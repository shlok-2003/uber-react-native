import { NextRequest, NextResponse } from "next/server";
import { Stripe } from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: NextRequest) {
    try {
        const { name, email, amount } = await request.json();

        if (!name || !email || !amount) {
            return NextResponse.json(
                { success: false, error: "Missing required fields" },
                { status: 400 },
            );
        }

        let customer;
        let doesCustomerExist = await stripe.customers.list({ email });

        if (doesCustomerExist.data.length > 0) {
            customer = doesCustomerExist.data[0];
        } else {
            customer = await stripe.customers.create({ name, email });
        }

        const ephemeralKey = await stripe.ephemeralKeys.create(
            { customer: customer.id },
            { apiVersion: "2024-12-18.acacia" },
        );

        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(parseInt(amount) * 100),
            currency: "usd",
            customer: customer.id,
            automatic_payment_methods: {
                enabled: true,
                allow_redirects: "never",
            },
        });

        return NextResponse.json({
            success: true,
            paymentIntent: paymentIntent.client_secret,
            ephemeralKey: ephemeralKey.secret,
            customer: customer.id,
        });
    } catch (error) {
        console.error("Error creating payment intent", error);
        return NextResponse.json(
            { success: false, error: "Internal Server Error" },
            { status: 500 },
        );
    }
}
