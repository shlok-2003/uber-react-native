import { FlatList, View } from "react-native";
import { router } from "expo-router";

import RideLayout from "@/layouts/ride";
import Button from "@/components/button";
import DriverCard from "@/components/driver-card";

import { useDriverStore } from "@/stores";

const ConfirmRide = () => {
    const { drivers, selectedDriver, setSelectedDriver } = useDriverStore();

    return (
        <RideLayout title="Choose a Rider" snapPoints={["65%", "85%"]}>
            <FlatList
                data={drivers}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => (
                    <DriverCard
                        item={item}
                        selected={selectedDriver!}
                        setSelected={() => setSelectedDriver(item.id!)}
                    />
                )}
                ListFooterComponent={() => (
                    <View className="mx-5 mt-10">
                        <Button
                            title="Select Ride"
                            disabled={!selectedDriver}
                            onPress={() => router.push("/book-ride")}
                        />
                    </View>
                )}
            />
        </RideLayout>
    );
};

export default ConfirmRide;
