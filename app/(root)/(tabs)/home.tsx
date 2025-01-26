import { useEffect, useState } from "react";
import { router } from "expo-router";

import * as Location from "expo-location";
import { useUser, useAuth } from "@clerk/clerk-expo";
import {
    Text,
    View,
    Image,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Map from "@/components/map";
import RideCard from "@/components/ride-card";
import GoogleInput from "@/components/google-text-input";

import { useLocationStore } from "@/stores";
import { useFetch } from "@/hooks/use-fetch";
import { icons, images } from "@/lib/constants";

import { Ride } from "@/types/types";

export default function Home() {
    const { user } = useUser();
    const { signOut } = useAuth();
    const { setUserLocation, setDestinationLocation } = useLocationStore();

    const {
        data: recentRides,
        loading,
        error,
    } = useFetch<Ride[]>(`/(api)/ride/${user?.id}`);

    const [hasPermission, setHasPermission] = useState(true);

    function handleSignOut() {
        signOut();
    }

    function handleDestinationPress(location: {
        latitude: number;
        longitude: number;
        address: string;
    }) {
        setDestinationLocation(location);
        router.push("/find-ride");
    }

    useEffect(() => {
        (async () => {
            try {
                const { status } =
                    await Location.requestForegroundPermissionsAsync();

                if (status !== "granted") {
                    setHasPermission(false);
                    return;
                }

                const location = await Location.getCurrentPositionAsync({
                    accuracy: Location.Accuracy.Highest,
                    timeInterval: 1000,
                });

                const address = await Location.reverseGeocodeAsync({
                    latitude: location.coords?.latitude!,
                    longitude: location.coords?.longitude!,
                });

                setUserLocation({
                    latitude: location.coords?.latitude,
                    longitude: location.coords?.longitude,
                    address: `${address[0].name}, ${address[0].region}`,
                });
            } catch (error) {
                console.log("error", error);
            }
        })();
    }, [setUserLocation]);

    if (!hasPermission) {
        return (
            <View className="flex justify-center items-center bg-white h-full gap-2">
                <Text className="text-2xl font-JakartaBold">
                    Please grant app permission to access your location
                </Text>
                <ActivityIndicator size="large" color="#000" />
            </View>
        );
    }

    if (error) {
        return (
            <View className="flex justify-center items-center bg-white h-full gap-2">
                <Text className="text-2xl font-JakartaBold text-center">
                    Error in the Application, Try again later
                </Text>
            </View>
        );
    }

    return (
        <SafeAreaView className="bg-general-500">
            <FlatList
                data={recentRides}
                renderItem={({ item }) => <RideCard ride={item} />}
                keyboardShouldPersistTaps="handled"
                className="px-5"
                contentContainerStyle={{
                    paddingBottom: 100,
                }}
                ListEmptyComponent={() => (
                    <View className="flex flex-col items-center justify-center">
                        {!loading ? (
                            <>
                                <Image
                                    source={images.noResult}
                                    className="w-40 h-40"
                                    alt="No recent rides found"
                                    resizeMode="contain"
                                />
                                <Text className="text-sm">
                                    No recent rides found
                                </Text>
                            </>
                        ) : (
                            <ActivityIndicator size="small" color="#000" />
                        )}
                    </View>
                )}
                ListHeaderComponent={
                    <>
                        <View className="flex flex-row items-center justify-between my-10">
                            <Text className="text-2xl font-JakartaExtraBold">
                                Welcome {user?.firstName}👋
                            </Text>
                            <TouchableOpacity
                                onPress={handleSignOut}
                                className="justify-center items-center w-10 h-10 rounded-full bg-white"
                            >
                                <Image source={icons.out} className="w-4 h-4" />
                            </TouchableOpacity>
                        </View>

                        <GoogleInput
                            icon={icons.search}
                            className="bg-white shadow-md shadow-neutral-300"
                            handlePress={handleDestinationPress}
                        />

                        <>
                            <Text className="text-xl font-JakartaBold mt-5 mb-3">
                                Your current location
                            </Text>
                            <View className="flex flex-row items-center bg-transparent h-[300px]">
                                <Map />
                            </View>
                        </>

                        <Text className="text-xl font-JakartaBold mt-5 mb-3">
                            Recent Rides
                        </Text>
                    </>
                }
            />
        </SafeAreaView>
    );
}
