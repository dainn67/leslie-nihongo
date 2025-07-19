import React from "react";
import { ChatBubble, Sender } from "./chatBubble";

import { ScrollView } from "react-native";

export const ChatMessageList = () => {
  const messages = [
    { id: 1, text: "Hello, I am Compari", sender: Sender.BOT },
    { id: 2, text: "Hello, how are you?", sender: Sender.USER },
    { id: 3, text: "I am good, thank you!", sender: Sender.BOT },
    { id: 4, text: "What is your name?", sender: Sender.USER },
    { id: 5, text: "My name is Compari", sender: Sender.BOT },
    { id: 6, text: "What is your favorite color?", sender: Sender.USER },
    { id: 7, text: "My favorite color is blue", sender: Sender.BOT },
    { id: 8, text: "What is your favorite food?", sender: Sender.USER },
    { id: 9, text: "My favorite food is pizza", sender: Sender.BOT },
    { id: 10, text: "What is your favorite animal?", sender: Sender.USER },
    { id: 11, text: "My favorite animal is a dog", sender: Sender.BOT },
    { id: 12, text: "What is your favorite sport?", sender: Sender.USER },
    { id: 13, text: "My favorite sport is basketball", sender: Sender.BOT },
    { id: 14, text: "What is your favorite movie?", sender: Sender.USER },
    {
      id: 15,
      text: "Fav movie: The Dark Knight",
      sender: Sender.BOT,
    },
    {
      id: 16,
      text: "What is your favorite book?",
      sender: Sender.USER,
    },
    {
      id: 17,
      text: "My favorite book is The Great Gatsby",
      sender: Sender.BOT,
    },
  ];

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: "white",
      }}
      contentContainerStyle={{
        paddingHorizontal: 8,
      }}
    >
      {messages.map((message) => (
        <ChatBubble key={message.id} message={message} />
      ))}
    </ScrollView>
  );
};
