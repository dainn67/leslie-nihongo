import axios from "axios";

export class ApiClient {
  static postData = async ({ url, headers, token, body }: { url: string; token?: string; body: any; headers?: any }) => {
    try {
      const response = await axios.post(url, body, {
        headers: {
          ...headers,
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });
      return response.data;
    } catch (error) {
      console.log("apiClient error:", error, (error as any).response?.data);
      return null;
    }
  };
}
