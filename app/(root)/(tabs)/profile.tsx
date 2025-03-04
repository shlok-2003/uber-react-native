import { Image, ScrollView, Text, View } from "react-native";

import { useUser } from "@clerk/clerk-expo";
import { SafeAreaView } from "react-native-safe-area-context";

import Input from "@/components/input";

const Profile = () => {
    const { user } = useUser();

    return (
        <SafeAreaView className="flex-1">
            <ScrollView
                className="px-5"
                contentContainerStyle={{ paddingBottom: 120 }}
            >
                <Text className="text-2xl font-JakartaBold my-5">
                    My profile
                </Text>

                <View className="flex items-center justify-center my-5">
                    <Image
                        source={{
                            uri:
                                user?.externalAccounts[0]?.imageUrl ??
                                user?.imageUrl,
                        }}
                        style={{
                            width: 110,
                            height: 110,
                            borderRadius: 110 / 2,
                        }}
                        className=" rounded-full h-[110px] w-[110px] border-[3px] border-white shadow-sm shadow-neutral-300"
                    />
                </View>

                <View className="flex flex-col items-start justify-center bg-white rounded-lg shadow-sm shadow-neutral-300 px-5 py-3">
                    <View className="flex flex-col items-start justify-start w-full">
                        <Input
                            label="First name"
                            placeholder={user?.firstName || "Not Found"}
                            className="w-full"
                            inputStyle="p-3.5"
                            editable={false}
                        />

                        <Input
                            label="Last name"
                            placeholder={user?.lastName || "Not Found"}
                            className="w-full"
                            inputStyle="p-3.5"
                            editable={false}
                        />

                        <Input
                            label="Email"
                            placeholder={
                                user?.primaryEmailAddress?.emailAddress ||
                                "Not Found"
                            }
                            className="w-full"
                            inputStyle="p-3.5"
                            editable={false}
                        />

                        <Input
                            label="Phone"
                            placeholder={
                                user?.primaryPhoneNumber?.phoneNumber ||
                                "Not Found"
                            }
                            className="w-full"
                            inputStyle="p-3.5"
                            editable={false}
                        />
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default Profile;
