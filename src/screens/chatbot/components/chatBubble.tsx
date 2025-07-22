import React from "react";
import { View, StyleSheet } from "react-native";
import { Sender } from "../../../features/chatbot/types";
import { useTheme } from "../../../theme";
import { WordComponent } from "../../../components/streamingText/WordComponent";
import { MainButton } from "../../../components/buttons";
import { ChatMessage } from "../../../features/chatbot/types";
import { LoadingText } from "./loadingText";

interface ChatBubbleProps {
  message: ChatMessage;
  isInitialMessage?: boolean;
  showButtons?: boolean;
}

export const ChatBubble = ({ message, showButtons }: ChatBubbleProps) => {
  const { colors } = useTheme();
  const isUser = message.sender === Sender.USER;

  const bubbleStyle = [
    styles.bubble,
    isUser ? styles.userBubble : styles.botBubble,
    {
      backgroundColor: isUser ? colors.primary : colors.card,
      paddingHorizontal: isUser ? 16 : 0,
    },
  ];

  return (
    <View
      id={message.id}
      style={[
        styles.container,
        isUser ? styles.userContainer : styles.botContainer,
      ]}
    >
      <View style={bubbleStyle}>
        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
          {message.loading && <LoadingText text="Analyzing" />}
          {!message.loading &&
            message.words.map((word, index) => (
              <WordComponent
                key={index}
                fontSize={16}
                word={word}
                color={isUser ? "white" : "black"}
              />
            ))}
        </View>
        {showButtons && (
          <View style={{ flexDirection: "row" }}>
            {[1, 2, 3].map((e, i) => {
              return (
                <MainButton
                  key={i}
                  title={`Button ${e.toString()}`}
                  radius={16}
                  width={100}
                  paddingVertical={12}
                  marginHorizontal={4}
                  marginVertical={4}
                  backgroundColor={colors.primary}
                  textColor="white"
                  onPress={() => {}}
                />
              );
            })}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    paddingHorizontal: 8,
  },
  userContainer: {
    alignItems: "flex-end",
    marginLeft: 32,
  },
  botContainer: {
    alignItems: "flex-start",
  },
  bubble: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
  },
  userBubble: {
    borderTopRightRadius: 6,
  },
  botBubble: {
    borderTopLeftRadius: 6,
  },
  text: {
    fontSize: 16,
    lineHeight: 22,
    letterSpacing: 0.2,
  },
});
