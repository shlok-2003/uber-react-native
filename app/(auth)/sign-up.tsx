import { useState } from "react";
import { Image, Text, View, Alert, ScrollView } from "react-native";

import { Link, router } from "expo-router";
import { useSignUp } from "@clerk/clerk-expo";
import { ReactNativeModal } from "react-native-modal";
import { ClerkAPIResponseError } from "@clerk/shared/error";

import Input from "@/components/input";
import OAuth from "@/components/o-auth";
import Button, { ProgressButton } from "@/components/button";

import fetchAPI from "@/lib/fetch";
import { icons, images } from "@/lib/constants";

export default function SignUp() {
    const { isLoaded, signUp, setActive } = useSignUp();

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
    });
    const [verification, setVerification] = useState({
        status: "default",
        code: "",
        error: "",
    });
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const handleSignUp = async () => {
        if (!isLoaded) return;

        try {
            const [firstName, lastName] = form.name.split(" ");

            await signUp.create({
                emailAddress: form.email,
                password: form.password,
                firstName,
                lastName: lastName ?? undefined,
            });

            await signUp.prepareEmailAddressVerification({
                strategy: "email_code",
            });

            setVerification((prev) => ({
                ...prev,
                status: "pending",
            }));
        } catch (err) {
            console.error(JSON.stringify(err, null, 2));
            Alert.alert(
                "Error",
                (err as ClerkAPIResponseError).errors[0].longMessage,
            );
            setForm((prev) => ({
                ...prev,
                password: "",
            }));
        }
    };

    const handleVerifyPress = async () => {
        if (!isLoaded) return;

        try {
            const signUpAttempt = await signUp.attemptEmailAddressVerification({
                code: verification.code,
            });

            if (signUpAttempt.status === "complete") {
                await fetchAPI("/(api)/user", {
                    method: "POST",
                    body: JSON.stringify({
                        name: form.name,
                        email: form.email,
                        clerk_id: signUpAttempt.createdUserId,
                    }),
                });

                await setActive({ session: signUpAttempt.createdSessionId });
                setVerification((prev) => ({
                    ...prev,
                    status: "success",
                }));
                setForm((prev) => ({
                    ...prev,
                    name: "",
                    email: "",
                    password: "",
                }));
            } else {
                setVerification((prev) => ({
                    ...prev,
                    status: "failed",
                    error: "Verification failed. Please try again.",
                }));
                console.error(JSON.stringify(signUpAttempt, null, 2));
            }
        } catch (err) {
            console.error(JSON.stringify(err, null, 2));
            setVerification((prev) => ({
                ...prev,
                status: "failed",
                error:
                    (err as ClerkAPIResponseError).errors[0].longMessage ||
                    "Verification failed. Please try again.",
            }));
        }
    };

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
                        Create Your Account
                    </Text>
                </View>

                <View className="p-5">
                    <Input
                        label="Name"
                        placeholder="Enter your name"
                        icon={icons.person}
                        value={form.name}
                        onChangeText={(value) =>
                            setForm({ ...form, name: value })
                        }
                    />
                    <Input
                        label="Email"
                        placeholder="Enter your email"
                        icon={icons.email}
                        value={form.email}
                        keyboardType="email-address"
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
                        title="Sign Up"
                        onPress={handleSignUp}
                        className="mt-6"
                    />

                    <OAuth />

                    <Link
                        href="/sign-in"
                        className="text-lg text-center text-general-200 mt-10"
                    >
                        <Text>Already have an account? </Text>
                        <Text className="text-primary-500">Sign In</Text>
                    </Link>
                </View>

                {/* Verification Modal */}
                <ReactNativeModal
                    isVisible={verification.status === "pending"}
                    onModalHide={() => {
                        if (verification.status === "success") {
                            setShowSuccessModal(true);
                        }
                    }}
                >
                    <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px]">
                        <Text className="text-2xl font-JakartaBold mb-2">
                            Verification
                        </Text>

                        <Text className="font-Jakarta mb-5">
                            We've sent a verification code to your email.
                        </Text>

                        <Input
                            label="Code"
                            placeholder="12345"
                            value={verification.code}
                            icon={icons.lock}
                            keyboardType="numeric"
                            onChangeText={(value) =>
                                setVerification({
                                    ...verification,
                                    code: value,
                                })
                            }
                        />

                        {verification.error && (
                            <Text className="text-red-500 text-sm mt-1">
                                {verification.error}
                            </Text>
                        )}

                        <Button
                            title="Verify Email"
                            onPress={handleVerifyPress}
                            className="mt-5 bg-success-500"
                        />
                    </View>
                </ReactNativeModal>

                {/* Success Modal */}
                <ReactNativeModal isVisible={showSuccessModal}>
                    <View className="bg-white px-7 py-9 rounded-2xl min-h-[200px]">
                        <Image
                            source={images.check}
                            className="w-[110px] h-[110px] mx-auto my-5"
                        />

                        <Text className="text-3xl font-JakartaBold text-center">
                            Verified
                        </Text>

                        <Text className="text-base text-gray-400 text-center font-Jakarta">
                            You have successfully verified your account.
                        </Text>

                        {/* <Button
                            title="Browse Home"
                            onPress={() => {
                                setShowSuccessModal(false);
                                router.replace("/home");
                            }}
                            className="mt-5"
                        /> */}

                        <ProgressButton
                            title="Browse Home"
                            onPress={() => {
                                setShowSuccessModal(false);
                                router.replace("/home");
                            }}
                        />
                    </View>
                </ReactNativeModal>
            </View>
        </ScrollView>
    );
}
