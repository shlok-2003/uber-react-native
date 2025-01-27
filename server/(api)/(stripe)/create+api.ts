import { Stripe } from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, amount } = body;

        if (!name || !email || !amount) {
            return new Response(
                JSON.stringify({ error: "Missing required fields" }),
                {
                    status: 400,
                },
            );
        }

        let customer;
        const doesCustomerExist = await stripe.customers.list({
            email,
        });

        if (doesCustomerExist.data.length > 0) {
            customer = doesCustomerExist.data[0];
        } else {
            const newCustomer = await stripe.customers.create({
                name,
                email,
            });

            customer = newCustomer;
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

        return new Response(
            JSON.stringify({
                paymentIntent: paymentIntent.client_secret,
                ephemeralKey: ephemeralKey.secret,
                customer: customer.id,
                publishableKey: process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
            }),
        );
    } catch (error) {
        return new Response(
            JSON.stringify({ error: "Internal server error" }),
            { status: 500 },
        );
    }
}
