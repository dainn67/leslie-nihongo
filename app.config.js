export default {
  expo: {
    name: "Leslie AI",
    slug: "leslieai",
    icon: "./assets/images/torii-logo.png",
    splash: {
      image: "./assets/images/torii-logo.png",
      resizeMode: "contain",
      backgroundColor: "#000000",
    },
    android: {
      package: "com.leslie.app",
    },
    ios: {
      bundleIdentifier: "com.leslie.app",
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
