import { ActivityIndicator, FlatList, Image, Text, View } from "react-native";

import { useUser } from "@clerk/clerk-expo";
import { SafeAreaView } from "react-native-safe-area-context";

import RideCard from "@/components/ride-card";
import { images } from "@/lib/constants";
import { useFetch } from "@/hooks/use-fetch";

import { Ride } from "@/types/types";

const Rides = () => {
    const { user } = useUser();

    const {
        data: recentRides,
        loading,
        error,
    } = useFetch<Ride[]>(`/ride/${user?.id}`);

    if (error) {
        return (
            <View className="flex justify-center items-center h-full">
                <Text className="text-2xl font-JakartaBold text-center">
                    Error, Try again later
                </Text>
            </View>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-white">
            <FlatList
                data={recentRides}
                renderItem={({ item }) => <RideCard ride={item} />}
                keyExtractor={(_, index) => index.toString()}
                className="px-5"
                keyboardShouldPersistTaps="handled"
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
                        <Text className="text-2xl font-JakartaBold my-5">
                            All Rides
                        </Text>
                    </>
                }
            />
        </SafeAreaView>
    );
};

export default Rides;
