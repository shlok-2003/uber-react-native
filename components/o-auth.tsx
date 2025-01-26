import { useCallback } from "react";
import { Alert, Image, Text, View } from "react-native";

import { router } from "expo-router";
import { useOAuth } from "@clerk/clerk-expo";
import Button from "@/components/button";

import { icons } from "@/lib/constants";
import { googleOAuth } from "@/lib/auth";

export default function OAuth() {
    const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });

    const handleGoogleLogin = useCallback(async () => {
        const result = await googleOAuth(startOAuthFlow);

        if (result.code === "session_exists") {
            router.replace("/home");
        }

        Alert.alert(result.success ? "Success" : "Failed", result.message);
    }, [startOAuthFlow]);

    return (
        <View>
            <View className="flex flex-row justify-center items-center mt-4 gap-x-3">
                <View className="flex-1 h-[1px] bg-general-100" />
                <Text className="text-lg">Or</Text>
                <View className="flex-1 h-[1px] bg-general-100" />
            </View>

            <Button
                title="Log in with Google"
                className="mt-5 w-full gap-2 shadow-none"
                IconLeft={() => (
                    <Image
                        source={icons.google}
                        resizeMode="contain"
                        className="w-5 h-5"
                    />
                )}
                variant="outline"
                textColor="primary"
                onPress={handleGoogleLogin}
            />
        </View>
    );
}
