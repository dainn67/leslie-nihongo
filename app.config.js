import dotenv from "dotenv/config";

export default {
    expo: {
        name: "LeslieAI",
        slug: "leslieai",
        extra: {
            DIFY_API_KEY: process.env.DIFY_API_KEY,
        },
    },
};