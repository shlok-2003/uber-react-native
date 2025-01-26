import { useState, useCallback } from "react";
import { Link, router } from "expo-router";

import { useSignIn } from "@clerk/clerk-expo";
import { ClerkAPIResponseError } from "@clerk/shared/error";
import { Image, Text, View, Alert, ScrollView } from "react-native";

import Input from "@/components/input";
import OAuth from "@/components/o-auth";
import Button from "@/components/button";

import { icons, images } from "@/lib/constants";

export default function SignUp() {
    const { signIn, setActive, isLoaded } = useSignIn();
    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const handleSignIn = useCallback(async () => {
        if (!isLoaded) return;

        try {
            const signInAttempt = await signIn.create({
                identifier: form.email,
                password: form.password,
            });

            if (signInAttempt.status === "complete") {
                await setActive({ session: signInAttempt.createdSessionId });
                router.replace("/home");
            } else {
                console.error(JSON.stringify(signInAttempt, null, 2));
                Alert.alert("Error", "Log in failed. Please try again.");
            }
        } catch (err) {
            console.error(JSON.stringify(err, null, 2));
            Alert.alert(
                "Error",
                (err as ClerkAPIResponseError).errors[0].longMessage,
            );
        }
    }, [isLoaded, form, signIn, setActive]);

    return (
        <ScrollView
            className="flex-1 bg-white"
            showsVerticalScrollIndicator={false}
        >
            <View className="flex-1 bg-white">
                <View className="relative w-full h-[250px]">
                    <Image
                        source={images.signUpCar}
                        className="z-0 w-full h-[250px]"
                    />
                    <Text className="text-2xl text-black font-JakartaSemiBold absolute bottom-5 left-5">
                        Welcome 👋
                    </Text>
                </View>

                <View className="p-5">
                    <Input
                        label="Email"
                        placeholder="Enter your email"
                        icon={icons.email}
                        keyboardType="email-address"
                        value={form.email}
                        onChangeText={(value) =>
                            setForm({ ...form, email: value })
                        }
                    />
                    <Input
                        label="Password"
                        placeholder="Enter your password"
                        icon={icons.lock}
                        value={form.password}
                        secureTextEntry={true}
                        onChangeText={(value) =>
                            setForm({ ...form, password: value })
                        }
                    />

                    <Button
                        title="Sign In"
                        onPress={handleSignIn}
                        className="mt-6"
                    />

                    <OAuth />

                    <Link
                        href="/sign-up"
                        className="text-lg text-center text-general-200 mt-10"
                    >
                        <Text>Don't have an account? </Text>
                        <Text className="text-primary-500">Sign Up</Text>
                    </Link>
                </View>
            </View>
        </ScrollView>
    );
}
