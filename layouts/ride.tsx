import { useRef } from "react";
import { Text, View, Image, TouchableOpacity } from "react-native";

import { router } from "expo-router";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import Map from "@/components/map";
import { icons } from "@/lib/constants";

interface LayoutProps {
    title: string;
    snapPoints?: string[];
    children?: React.ReactNode;
}

export default function Layout({ title, children, snapPoints }: LayoutProps) {
    const bottomSheetRef = useRef<BottomSheet>(null);

    return (
        <GestureHandlerRootView className="flex-1">
            <View className="flex-1 bg-white">
                <View className="flex flex-col h-screen bg-blue-500">
                    <View className="flex flex-row absolute z-10 bg-white w-full items-center justify-start px-5">
                        <TouchableOpacity onPress={() => router.back()}>
                            <View className="w-10 h-10 bg-white rounded-full items-center justify-center">
                                <Image
                                    source={icons.backArrow}
                                    resizeMode="contain"
                                    className="w-6 h-6"
                                />
                            </View>
                        </TouchableOpacity>
                        <Text className="text-xl font-JakartaSemiBold ml-5">
                            {title || "Go Back"}
                        </Text>
                    </View>

                    <Map />
                </View>

                <BottomSheet
                    keyboardBehavior="extend"
                    ref={bottomSheetRef}
                    snapPoints={snapPoints || ["40%", "85%"]}
                    index={0}
                >
                    {title === "Choose a Rider" ? (
                        <BottomSheetView
                            style={{
                                flex: 1,
                                padding: 20,
                            }}
                        >
                            {children}
                        </BottomSheetView>
                    ) : (
                        <BottomSheetView
                            style={{
                                flex: 1,
                                padding: 20,
                            }}
                        >
                            {children}
                        </BottomSheetView>
                    )}
                </BottomSheet>
            </View>
        </GestureHandlerRootView>
    );
}
