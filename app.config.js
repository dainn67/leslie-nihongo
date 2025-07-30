export default {
  expo: {
    name: "LeslieAI",
    slug: "leslieai",
    icon: "./assets/images/leslie-logo.png",
    splash: {
      image: "./assets/images/leslie-logo.png",
      resizeMode: "contain",
      backgroundColor: "#000000",
    },
    android: {
      package: "com.leslieai.app",
    },
    ios: {
      bundleIdentifier: "com.leslieai.app",
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
