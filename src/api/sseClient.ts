import EventSource from "react-native-sse";

export const connectSSE = (
  url: string,
  token?: string,
  body?: any,
  onOpen?: () => void,
  onMessage?: (data: any) => void,
  onClose?: () => void,
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

  es.addEventListener("open", () => onOpen?.());

  es.addEventListener("message", (event) => {
    let parsed;
    try {
      parsed = JSON.parse(event.data ?? "");
      if (parsed.event === "message_end") onClose?.();
    } catch (e) {
      parsed = event.data;
    }
    onMessage?.(parsed);
  });

  es.addEventListener("error", (err) => onError?.(err));

  es.addEventListener("close", () => onClose?.());

  return {
    close: () => {
      es.removeAllEventListeners();
      es.close();
    },
    instance: es,
  };
};
