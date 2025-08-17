export default {
  expo: {
    owner: "dainn283",
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
      DIFY_CHAT_API_KEY: process.env.DIFY_CHAT_API_KEY,
      DIFY_ASSISTANT_API_KEY: process.env.DIFY_ASSISTANT_API_KEY,
      DIFY_ANALYZE_GAME_RESULT_API_KEY: process.env.DIFY_ANALYZE_GAME_RESULT_API_KEY,
      DIFY_EXTRACT_CONTEXT_API_KEY: process.env.DIFY_EXTRACT_CONTEXT_API_KEY,
      DISCORD_ERROR_WEBHOOKS: process.env.DISCORD_ERROR_WEBHOOKS,
      DISCORD_FEEDBACK_WEBHOOKS: process.env.DISCORD_FEEDBACK_WEBHOOKS,
      eas: {
        projectId: "1999df9a-b268-4992-933a-54bf931d0952",
      },
    },
  },
};
