import { ClerkProvider, ClerkLoaded } from "@clerk/clerk-expo";
import { useEffect } from "react";
import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";

import { tokenCache } from "@/lib/auth";
import "@/styles/globals.css";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

    const [loaded] = useFonts({
        "Jakarta-Bold": require("../assets/fonts/PlusJakartaSans-Bold.ttf"),
        "Jakarta-ExtraBold": require("../assets/fonts/PlusJakartaSans-ExtraBold.ttf"),
        "Jakarta-ExtraLight": require("../assets/fonts/PlusJakartaSans-ExtraLight.ttf"),
        "Jakarta-Light": require("../assets/fonts/PlusJakartaSans-Light.ttf"),
        "Jakarta-Medium": require("../assets/fonts/PlusJakartaSans-Medium.ttf"),
        "Jakarta-Regular": require("../assets/fonts/PlusJakartaSans-Regular.ttf"),
        "Jakarta-SemiBold": require("../assets/fonts/PlusJakartaSans-SemiBold.ttf"),
    });

    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync();
        }
    }, [loaded]);

    if (!publishableKey) {
        throw new Error(
            "Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env",
        );
    }

    if (!loaded) {
        return null;
    }

    return (
        <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
            <ClerkLoaded>
                <Stack screenOptions={{ headerShown: false }} />
            </ClerkLoaded>
        </ClerkProvider>
    );
}
