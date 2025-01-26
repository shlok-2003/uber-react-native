import { useEffect } from "react";
import { Text, TouchableOpacity, TouchableOpacityProps } from "react-native";

import { router } from "expo-router";
import { cva, type VariantProps } from "class-variance-authority";
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";

import { cn } from "@/lib/utils";

export const buttonVariants = cva(
    "w-full relative rounded-full p-3 flex flex-row justify-center items-center shadow-md shadow-neutral-400/70",
    {
        variants: {
            variant: {
                primary: "bg-[#0286FF]",
                secondary: "bg-gray-500",
                danger: "bg-red-500",
                success: "bg-green-500",
                outline: "bg-transparent border-[0.5px] border-neutral-300",
            },
        },
        defaultVariants: {
            variant: "primary",
        },
    },
);

export const textVariants = cva("text-md font-bold", {
    variants: {
        textColor: {
            default: "text-white",
            primary: "text-black",
            secondary: "text-gray-100",
            danger: "text-red-100",
            success: "text-green-100",
        },
    },
    defaultVariants: {
        textColor: "default",
    },
});

interface ButtonProps
    extends TouchableOpacityProps,
        VariantProps<typeof buttonVariants>,
        VariantProps<typeof textVariants> {
    title: string;
    textStyle?: string;
    IconLeft?: React.ComponentType<any>;
    IconRight?: React.ComponentType<any>;
}

export const ProgressButton = ({
    title,
    textColor,
    textStyle,
    IconLeft,
    IconRight,
    ...props
}: ButtonProps) => {
    const progress = useSharedValue(0);

    useEffect(() => {
        progress.value = withTiming(1, {
            duration: 5000,
            easing: Easing.linear,
        });
    }, [progress]);

    const animatedStyle = useAnimatedStyle(() => ({
        width: `${progress.value * 100}%`,
    }));

    setTimeout(() => {
        router.replace("/home");
    }, 5000);

    return (
        <Button
            title={title}
            textColor={textColor}
            className="mt-5 p-0 overflow-hidden"
            textStyle="p-5 z-10"
            {...props}
        >
            <Animated.View
                className="absolute top-0 left-0 h-full bg-green-500"
                style={animatedStyle}
            />
        </Button>
    );
};

export default function Button({
    title,
    textColor,
    textStyle,
    variant,
    IconLeft,
    IconRight,
    className,
    children,
    ...props
}: ButtonProps) {
    return (
        <TouchableOpacity
            className={cn(buttonVariants({ variant }), className)}
            {...props}
        >
            {IconLeft && <IconLeft />}

            <Text className={cn(textVariants({ textColor }), textStyle)}>
                {title}
            </Text>

            {IconRight && <IconRight />}

            {children}
        </TouchableOpacity>
    );
}
