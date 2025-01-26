import { Text, View } from "react-native";
import { router } from "expo-router";

import RideLayout from "@/layouts/ride";
import Button from "@/components/button";
import GoogleInput from "@/components/google-text-input";

import { icons } from "@/lib/constants";
import { useLocationStore } from "@/stores";

export default function FindRide() {
    const {
        userAddress,
        destinationAddress,
        setDestinationLocation,
        setUserLocation,
    } = useLocationStore();

    return (
        <RideLayout title="Ride">
            <View className="my-3">
                <Text className="text-lg font-JakartaSemiBold mb-3">From</Text>

                <GoogleInput
                    icon={icons.target}
                    initialLocation={userAddress!}
                    className="bg-neutral-100"
                    textInputBackgroundColor="#f5f5f5"
                    handlePress={(location) => setUserLocation(location)}
                />
            </View>

            <View className="my-3">
                <Text className="text-lg font-JakartaSemiBold mb-3">To</Text>

                <GoogleInput
                    icon={icons.map}
                    initialLocation={destinationAddress!}
                    className="bg-neutral-100"
                    textInputBackgroundColor="transparent"
                    handlePress={(location) => setDestinationLocation(location)}
                />
            </View>

            <Button
                title="Find Now"
                onPress={() => router.push("/confirm-ride")}
                className="mt-5"
            />
        </RideLayout>
    );
}
