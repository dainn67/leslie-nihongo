import Constants from "expo-constants";
import { ApiClient } from "../api/apiClient";

const { DISCORD_ERROR_WEBHOOKS } = Constants.expoConfig?.extra ?? {};

export class DiscordService {
  static sendDiscordMessage(message: string) {
    const webhookUrl = DISCORD_ERROR_WEBHOOKS;
    if (!webhookUrl) {
      console.error("DISCORD_WEBHOOK_URL is not set");
      return;
    }

    const payload = {
      username: "Dainn",
      allowed_mentions: { parse: [] },
      embeds: [
        {
          title: "App Report",
          color: 16711680,
          fields: [
            {
              name: "Error",
              value: message,
            },
          ],
          //   footer: { text: `Review ID: ${r.reviewId}` },
          timestamp: new Date().toISOString(),
        },
      ],
    };

    ApiClient.postData({
      url: webhookUrl,
      body: JSON.stringify(payload),
    });
  }
}
