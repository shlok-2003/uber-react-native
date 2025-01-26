import { Platform } from "react-native";

import * as Linking from "expo-linking";
import * as SecureStore from "expo-secure-store";
import {
    StartOAuthFlowParams,
    StartOAuthFlowReturnType,
} from "@clerk/clerk-expo";
import { TokenCache } from "@clerk/clerk-expo/dist/cache";
import { ClerkAPIResponseError } from "@clerk/shared/error";
import fetchAPI from "./fetch";

const createTokenCache = (): TokenCache => {
    return {
        getToken: async (key: string) => {
            try {
                const item = await SecureStore.getItemAsync(key);
                if (item) {
                    console.log(`${key} was used 🔐 \n`);
                } else {
                    console.log("No values stored under key: " + key);
                }
                return item;
            } catch (error) {
                console.error("secure store get item error: ", error);
                await SecureStore.deleteItemAsync(key);
                return null;
            }
        },
        saveToken: (key: string, token: string) => {
            return SecureStore.setItemAsync(key, token);
        },
    };
};

export const tokenCache =
    Platform.OS !== "web" ? createTokenCache() : undefined;

export const googleOAuth = async (
    startOAuthFlow: (
        options: StartOAuthFlowParams,
    ) => Promise<StartOAuthFlowReturnType>,
) => {
    try {
        const { createdSessionId, signUp, setActive } = await startOAuthFlow({
            redirectUrl: Linking.createURL("/home", {
                scheme: "myapp",
            }),
        });

        if (createdSessionId) {
            if (setActive) {
                await setActive!({ session: createdSessionId });

                if (!signUp?.createdUserId) {
                    await fetchAPI("/(api)/user", {
                        method: "POST",
                        body: JSON.stringify({
                            name: `${signUp?.firstName} ${signUp?.lastName}`,
                            email: signUp?.emailAddress,
                            clerkId: signUp?.createdUserId,
                        }),
                    });
                }

                return {
                    success: true,
                    code: "success",
                    message: "You have successfully authenticated",
                };
            }
        }
        return {
            success: false,
            code: "failed",
            message: "Something went wrong",
        };
    } catch (error) {
        console.error(error);
        return {
            success: false,
            code: "failed",
            message: (error as ClerkAPIResponseError).errors[0].longMessage,
        };
    }
};
