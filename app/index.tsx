import { Redirect } from "expo-router";
import "react-native-get-random-values";

export default function Main() {
    return <Redirect href="/(auth)/sign-up" />;
}
