export enum Sender {
  USER = "user",
  BOT = "bot",
}

export type ChatMessage = {
  id: string;
  text: string;
  sender: Sender;
  createdAt: string;
};
