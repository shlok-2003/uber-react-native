import { neon } from "@neondatabase/serverless";

export async function POST(request: Request) {
    const sql = neon(process.env.DATABASE_URL!);

    try {
        const { name, email, clerk_id } = await request.json();

        if (!name || !email || !clerk_id) {
            return new Response("Missing name, email, or clerkId", {
                status: 400,
            });
        }

        const response = await sql`
            INSERT INTO users (name, email, clerk_id) VALUES (${name}, ${email}, ${clerk_id})
        `;
        return new Response(JSON.stringify({ data: response }), {
            status: 201,
        });
    } catch (error) {
        console.error(error);
        return new Response("Internal Server Error", { status: 500 });
    }
}
