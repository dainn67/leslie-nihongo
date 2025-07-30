export default {
  expo: {
    name: "ToriiAI",
    slug: "torii-ai",
    icon: "./assets/images/torii-logo.png",
    splash: {
      image: "./assets/images/torii-logo.png",
      resizeMode: "contain",
      backgroundColor: "#000000",
    },
    android: {
      package: "com.torii.app",
    },
    ios: {
      bundleIdentifier: "com.torii.app",
    },
    plugins: ["expo-sqlite"],
    extra: {
      DIFY_API_KEY: process.env.DIFY_API_KEY,
      eas: {
        projectId: "1999df9a-b268-4992-933a-54bf931d0952",
      },
    },
  },
};
