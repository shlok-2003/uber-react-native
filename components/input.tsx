import { useState } from "react";
import {
    Text,
    View,
    Image,
    Platform,
    Keyboard,
    TextInput,
    TextInputProps,
    TouchableOpacity,
    ImageSourcePropType,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
} from "react-native";

import { cn } from "@/lib/utils";
import { icons } from "@/lib/constants";

export interface InputProps extends TextInputProps {
    icon?: ImageSourcePropType;
    label: string;
    iconStyle?: string;
    labelStyle?: string;
    inputStyle?: string;
}

export default function Input({
    icon,
    label,
    iconStyle,
    labelStyle,
    inputStyle,
    secureTextEntry,
    ...props
}: InputProps) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View className="my-2 w-full">
                    <Text
                        className={cn(
                            "text-lg font-JakartaSemiBold mb-3",
                            labelStyle,
                        )}
                    >
                        {label}
                    </Text>
                    <View className="flex flex-row justify-start items-center relative bg-neutral-100 rounded-full border border-neutral-100 focus:border-primary-500">
                        {icon && (
                            <Image
                                source={icon}
                                className={cn("w-6 h-6 ml-4", iconStyle)}
                                resizeMode="contain"
                            />
                        )}
                        <TextInput
                            className={cn(
                                "rounded-full p-4 font-JakartaSemiBold text-[15px] flex-1 text-left",
                                inputStyle,
                            )}
                            secureTextEntry={!showPassword && secureTextEntry}
                            {...props}
                        />
                        {secureTextEntry && (
                            <TouchableOpacity
                                onPress={() => setShowPassword(!showPassword)}
                            >
                                <Image
                                    source={
                                        !showPassword
                                            ? icons.eye
                                            : icons.eyeCross
                                    }
                                    className="w-6 h-6 mr-4"
                                    resizeMode="contain"
                                />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}
