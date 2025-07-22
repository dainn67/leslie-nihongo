import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppBar } from "../../components/AppBar";
import { ChatInput } from "./components/chatInput";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ChatMessageList } from "./components/chatMessageList";
import { useNavigation } from "@react-navigation/native";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import {
  addLoading,
  addMessage,
  clearChat,
} from "../../features/chatbot/chatMessageList/chatbotSlice";
import { ChatMessage, createChatMessage } from "../../features/chatbot/types";
import { AppConfig } from "../../config/appConfig";
import ClearChatDialog from "./components/clearChatDialog";
import { sendStreamMessageThunk as sendStreamMessage } from "../../features/chatbot/chatMessageStream/chatMessageThunk";

type DrawerParamList = {
  Chatbot: undefined;
  Counter: undefined;
};

type ChatbotScreenNavigationProp = DrawerNavigationProp<
  DrawerParamList,
  "Chatbot"
>;

export const ChatbotScreen = () => {
  // Drawer
  const navigation = useNavigation<ChatbotScreenNavigationProp>();
  const openDrawer = () => navigation.openDrawer();

  // Clear chat dialog
  const [visible, setVisible] = useState(false);

  const dispatch = useAppDispatch();
  const messages = useAppSelector((state) => state.chatbot.messages);

  useEffect(() => {
    if (messages.length === 0) {
      dispatch(addLoading());
      sendStreamMessage("Hello", dispatch);
    }
  }, [messages.length]);

  const handleSend = (message: string) => {
    const data = message.trim();
    const userMessage: ChatMessage = createChatMessage({ fullText: data });

    // Add user message & loading messages
    dispatch(addMessage(userMessage));
    dispatch(addLoading());

    // Send stream message to server
    sendStreamMessage(data, dispatch);
  };

  const openClearChatDialog = () => {
    setVisible(true);
  };

  const clearConversation = () => {
    dispatch(clearChat());
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <View style={{ flex: 1 }}>
          <AppBar
            title={AppConfig.name}
            leftIcon={<Ionicons name="menu" size={24} color="white" />}
            rightIcon={<Ionicons name="trash" size={24} color="white" />}
            onLeftPress={openDrawer}
            onRightPress={openClearChatDialog}
          />
          <ChatMessageList />
          <ChatInput onSend={handleSend} />

          <ClearChatDialog
            title="Clear All?"
            message="Are you sure you want to delete all messages?"
            cancelText="Cancel"
            confirmText="Confirm"
            visible={visible}
            setVisible={setVisible}
            clearConversation={clearConversation}
          />
        </View>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};
