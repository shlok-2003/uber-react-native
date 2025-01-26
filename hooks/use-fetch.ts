import { useEffect, useState, useCallback } from "react";
import fetchAPI from "@/lib/fetch";

export const useFetch = <T>(url: string, options?: RequestInit) => {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        setError(null);
        setLoading(true);

        try {
            const response = await fetchAPI(url, options);

            setData(response.data);
        } catch (error) {
            setError((error as Error).message);
        } finally {
            setLoading(false);
        }
    }, [url, options]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { data, loading, error, refetch: fetchData };
};
