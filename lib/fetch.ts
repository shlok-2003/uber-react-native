export default async function fetchAPI(url: string, options?: RequestInit) {
    try {
        const fullUrl = `${process.env.EXPO_PUBLIC_SERVER_URL}${url}`;
        console.log(fullUrl);
        const response = await fetch(`http://localhost:3000/api${url}`, {
            ...options,
            headers: {
                "Content-Type": "application/json",
                ...options?.headers,
            },
        });

        console.log(response.ok, url);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
}
