import { useAuth } from "@clerk/clerk-expo";
import { Redirect, Stack } from "expo-router";

export default function Layout() {
    const { isSignedIn } = useAuth();

    if (!isSignedIn) {
        return <Redirect href="/sign-in" />;
    }

    return (
        <Stack
            screenOptions={{
                headerShown: false,
            }}
        />
    );
}
