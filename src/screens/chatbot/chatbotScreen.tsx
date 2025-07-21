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
import { useAppDispatch } from "../../hooks/hooks";
import {
  addInitialMessage,
  addMessage,
  clearChat,
} from "../../features/chatbot/chatMessageList/chatbotSlice";
import { ChatMessage, Sender } from "../../features/chatbot/types";
import { AppConfig } from "../../config/appConfig";
import ClearChatDialog from "./components/clearChatDialog";
import { sendStreamMessageThunk } from "../../features/chatbot/chatMessageStream/chatMessageThunk";

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

  useEffect(() => {
    dispatch(addInitialMessage());
  }, []);

  const handleSend = (message: string) => {
    const userMessage: ChatMessage = {
      id: "user_message_" + Date.now(),
      text: message.trim(),
      sender: Sender.USER,
      createdAt: new Date().toISOString(),
    };

    dispatch(addMessage(userMessage));
    // dispatch(sendMessageThunk(userMessage));
    dispatch(sendStreamMessageThunk(message.trim()));
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
