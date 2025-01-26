import { View, Image, ViewProps, ImageSourcePropType } from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

import { cn } from "@/lib/utils";
import { icons } from "@/lib/constants";

export interface GoogleInputProps extends ViewProps {
    icon: ImageSourcePropType;
    className?: string;
    initialLocation?: string;
    textInputBackgroundColor?: string;
    handlePress: (location: {
        latitude: number;
        longitude: number;
        address: string;
    }) => void;
}

const googlePlacesApiKey = process.env.EXPO_PUBLIC_GOOGLE_API_KEY;

export default function GoogleInput({
    icon,
    className,
    handlePress,
    initialLocation,
    textInputBackgroundColor,
    ...props
}: GoogleInputProps) {
    return (
        <View
            className={cn(
                "flex flex-row items-center justify-center relative z-50 rounded-xl mb-5",
                className,
            )}
            {...props}
        >
            <GooglePlacesAutocomplete
                fetchDetails={true}
                placeholder="Search"
                debounce={200}
                styles={{
                    textInputContainer: {
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 20,
                        marginHorizontal: 20,
                        position: "relative",
                        shadowColor: "#d4d4d4",
                        overflow: "hidden",
                    },
                    textInput: {
                        backgroundColor: textInputBackgroundColor
                            ? textInputBackgroundColor
                            : "white",
                        fontSize: 16,
                        fontWeight: "600",
                        marginTop: 5,
                        width: "100%",
                        borderRadius: 200,
                        overflow: "hidden",
                    },
                    listView: {
                        backgroundColor: textInputBackgroundColor
                            ? textInputBackgroundColor
                            : "white",
                        position: "relative",
                        top: 0,
                        width: "100%",
                        borderRadius: 10,
                        shadowColor: "#d4d4d4",
                        zIndex: 99,
                    },
                }}
                onPress={(data, details = null) => {
                    handlePress({
                        latitude: details?.geometry.location.lat!,
                        longitude: details?.geometry.location.lng!,
                        address: data.description,
                    });
                }}
                numberOfLines={1}
                query={{
                    key: googlePlacesApiKey,
                    language: "en",
                }}
                renderLeftButton={() => (
                    <View className="justify-center items-center w-6 h-6">
                        <Image
                            source={icon ? icon : icons.search}
                            className="w-6 h-6"
                            resizeMode="contain"
                        />
                    </View>
                )}
                textInputProps={{
                    placeholderTextColor: "gray",
                    placeholder: initialLocation ?? "Where do you want to go?",
                    numberOfLines: 1,
                    maxLength: 100,
                    multiline: false,
                }}
            />
        </View>
    );
}
