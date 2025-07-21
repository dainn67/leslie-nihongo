import EventSource from "react-native-sse";

export const connectSSE = (
  url: string,
  token?: string,
  body?: any,
  onOpen?: () => void,
  onMessage?: (data: any) => void,
  onError?: (error: any) => void
) => {
  const es = new EventSource(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: body ? JSON.stringify(body) : undefined,
    pollingInterval: 0,
  });

  console.log("siuuuuuuuuuuu");

  es.addEventListener("open", () => onOpen?.());

  es.addEventListener("message", (event) => {
    let parsed;
    try {
      parsed = JSON.parse(event.data ?? "");
    } catch (e) {
      parsed = event.data;
    }
    onMessage?.(parsed);
  });

  es.addEventListener("error", (err) => onError?.(err));

  return {
    close: () => {
      es.removeAllEventListeners();
      es.close();
    },
    instance: es,
  };
};
