import { useRef, useState } from "react";
import { View, Image, Text, TouchableOpacity } from "react-native";

import { router } from "expo-router";
import Swiper from "react-native-swiper";
import { SafeAreaView } from "react-native-safe-area-context";

import Button from "@/components/button";

import { onboarding } from "@/lib/constants";

export default function Onboarding() {
    const swiperRef = useRef<Swiper>(null);
    const [index, setIndex] = useState<number>(0);
    const isLastIndex = index === onboarding.length - 1;

    return (
        <SafeAreaView className="flex h-full items-center justify-between bg-white">
            <TouchableOpacity
                className="flex self-end items-end p-5"
                onPress={() => {
                    router.push("/(auth)/sign-up");
                }}
            >
                <Text className="text-black text-md font-JakartaBold underline">
                    Skip
                </Text>
            </TouchableOpacity>

            <Swiper
                ref={swiperRef}
                loop={false}
                dot={
                    <View className="w-[32px] h-[4px] mx-1 bg-[#E2E8F0] rounded-full" />
                }
                activeDot={
                    <View className="w-[32px] h-[4px] mx-1 bg-[#0286FF] rounded-full" />
                }
                onIndexChanged={(index) => setIndex(index)}
            >
                {onboarding.map((item) => (
                    <View
                        key={item.id}
                        className="flex items-center justify-center p-5"
                    >
                        <Image
                            source={item.image}
                            className="w-full h-[200px]"
                            resizeMode="contain"
                        />

                        <View className="flex flex-row justify-center items-center w-full mt-10">
                            <Text className="text-black text-3xl font-bold mx-10 text-center">
                                {item.title}
                            </Text>
                        </View>

                        <Text className="text-[#858585] text-md font-JakartaSemiBold mt-3 mx-10 text-center">
                            {item.description}
                        </Text>
                    </View>
                ))}
            </Swiper>

            <Button
                className="w-11/12 mt-10 mb-5 p-5"
                title={isLastIndex ? "Get Started" : "Next"}
                onPress={() =>
                    isLastIndex
                        ? router.replace("/(auth)/sign-up")
                        : swiperRef.current?.scrollBy(1)
                }
                activeOpacity={0.8}
            />
        </SafeAreaView>
    );
}
