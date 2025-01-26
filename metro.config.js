const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// config.resolver.blocklist = [
//     /react-native\/Libraries\/Utilities\/codegenNativeCommands/,
//     /react-native-maps\/lib\/.*/,
// ];

module.exports = withNativeWind(config, { input: "./styles/globals.css" });
