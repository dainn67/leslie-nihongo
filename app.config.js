import dotenv from "dotenv/config";

export default {
    expo: {
        name: "LeslieAI",
        slug: "leslieai",
        android: {
            package: "com.leslieai.app",
        },
        extra: {
            DIFY_API_KEY: process.env.DIFY_API_KEY,
            eas: {
                projectId: "1999df9a-b268-4992-933a-54bf931d0952"
            }
        },
    },
};