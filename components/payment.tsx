/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState, useCallback } from "react";
import { ActivityIndicator, Alert, Image, Text, View } from "react-native";

import { router } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import { ReactNativeModal } from "react-native-modal";
import {
    initPaymentSheet,
    presentPaymentSheet,
} from "@stripe/stripe-react-native";

import Button, { ProgressButton } from "@/components/button";
import fetchAPI from "@/lib/fetch";
import { images } from "@/lib/constants";
import { useLocationStore } from "@/stores";

import { PaymentProps } from "@/types/types";

const Payment = ({
    fullName,
    email,
    amount,
    driverId,
    rideTime,
}: PaymentProps) => {
    const {
        userAddress,
        userLongitude,
        userLatitude,
        destinationLatitude,
        destinationAddress,
        destinationLongitude,
    } = useLocationStore();

    const { userId } = useAuth();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState<boolean>(false);

    const initializePaymentSheet = useCallback(async () => {
        try {
            setLoading(true);
            const { paymentIntent, ephemeralKey, customer } = await fetchAPI(
                "/create",
                {
                    method: "POST",
                    body: JSON.stringify({
                        name: fullName,
                        email: email,
                        amount: amount,
                    }),
                },
            );

            const { error } = await initPaymentSheet({
                merchantDisplayName: "Example, Inc.",
                customerId: customer,
                customerEphemeralKeySecret: ephemeralKey,
                paymentIntentClientSecret: paymentIntent,
                allowsDelayedPaymentMethods: true,
                defaultBillingDetails: {
                    name: fullName,
                    email: email,
                    phone: "1234567890",
                },
                returnURL: "stripe-redirect",
            });
            if (!error) {
                setLoading(false);
            }
        } catch (error) {
            console.log(error);
        }
    }, [amount, email, fullName]);

    const openPaymentSheet = async () => {
        const { error, paymentOption } = await presentPaymentSheet();

        console.log(error, paymentOption);

        if (error) {
            Alert.alert(`Error code: ${error.code}`, error.message);
        } else {
            Alert.alert("Success", "Your order is confirmed!");
        }
    };

    useEffect(() => {
        initializePaymentSheet();
    }, [initializePaymentSheet]);

    if (loading) {
        return <ActivityIndicator size="large" color="#000" />;
    }

    return (
        <>
            <Button
                title="Confirm Ride"
                className="my-10"
                onPress={openPaymentSheet}
            />

            <ReactNativeModal
                isVisible={success}
                onBackdropPress={() => setSuccess(false)}
            >
                <View className="flex flex-col items-center justify-center bg-white p-7 rounded-2xl">
                    <Image source={images.check} className="w-28 h-28 mt-5" />

                    <Text className="text-2xl text-center font-JakartaBold mt-5">
                        Booking placed successfully
                    </Text>

                    <Text className="text-md text-general-200 font-JakartaRegular text-center mt-3">
                        Thank you for your booking. Your reservation has been
                        successfully placed. Please proceed with your trip.
                    </Text>

                    <ProgressButton
                        title="Back Home"
                        onPress={() => {
                            setSuccess(false);
                            router.push("/(root)/(tabs)/home");
                        }}
                        className="mt-5"
                    />
                </View>
            </ReactNativeModal>
        </>
    );
};

export default Payment;
