import { icons } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Tabs } from "expo-router";
import { View, Image, Pressable, ImageSourcePropType } from "react-native";

interface TabIconProps {
    focused: boolean;
    source: ImageSourcePropType;
}

const TabIcon = ({ source, focused }: TabIconProps) => (
    <View
        className={cn(
            "flex flex-row justify-center h-12 w-12 items-center rounded-full",
            focused && "bg-general-300",
        )}
    >
        <View
            className={cn(
                "rounded-full w-12 h-12 items-center justify-center",
                focused && "bg-general-400",
            )}
        >
            <Image
                source={source}
                tintColor="white"
                resizeMode="contain"
                className="w-7 h-7"
            />
        </View>
    </View>
);

export default function Layout() {
    return (
        <Tabs
            initialRouteName="home"
            screenOptions={{
                tabBarActiveTintColor: "white",
                tabBarInactiveTintColor: "white",
                tabBarShowLabel: false,
                tabBarStyle: {
                    backgroundColor: "#333333",
                    borderRadius: 50,
                    paddingBottom: 0, // ios only
                    overflow: "hidden",
                    marginHorizontal: 20,
                    marginBottom: 20,
                    height: 78,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexDirection: "row",
                    position: "absolute",
                },
                tabBarButton: ({ children, onPress, ...props }) => (
                    <Pressable
                        {...props}
                        style={{}}
                        onPress={onPress}
                        android_ripple={null}
                        className="flex-1 items-center justify-center"
                    >
                        {children}
                    </Pressable>
                ),
            }}
        >
            <Tabs.Screen
                name="home"
                options={{
                    title: "Home",
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <TabIcon source={icons.home} focused={focused} />
                    ),
                }}
            />
            <Tabs.Screen
                name="rides"
                options={{
                    title: "Rides",
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <TabIcon source={icons.list} focused={focused} />
                    ),
                }}
            />
            <Tabs.Screen
                name="chat"
                options={{
                    title: "Chat",
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <TabIcon source={icons.chat} focused={focused} />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: "Profile",
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <TabIcon source={icons.profile} focused={focused} />
                    ),
                }}
            />
        </Tabs>
    );
}
