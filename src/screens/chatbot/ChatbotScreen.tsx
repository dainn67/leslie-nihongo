import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppBar } from "../../components/AppBar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ChatMessageList } from "./components/ChatMessageList";
import { useNavigation } from "@react-navigation/native";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { AppConfig } from "../../constants/appConfig";
import { addLoading, addMessage, clearChat } from "../../features/chatbot/chatMessageList/chatbotSlice";
import { clearUserProgress, setUserLevel, setUserProgress, setUserTarget } from "../../features/userProgress/userProgressSlice";
import { clearAllTables, createQuestionTable } from "../../storage/database/tables";
import { createChatMessage } from "../../models/chatMessage";
import { sendStreamMessage } from "../../api/chatMessageAPI";
import { getUserProgressFromStorage } from "../../service/userProgressSerivice";
import ClearChatDialog from "./components/ClearChatDialog";
import ChatInput from "./components/ChatInput";
import * as FileSystem from "expo-file-system";

type DrawerParamList = {
  Chatbot: undefined;
  Counter: undefined;
};

type ChatbotScreenNavigationProp = DrawerNavigationProp<DrawerParamList, "Chatbot">;

export const ChatbotScreen = () => {
  // Drawer
  const navigation = useNavigation<ChatbotScreenNavigationProp>();
  const openDrawer = () => navigation.openDrawer();

  // Clear chat dialog
  const [clearDialogVisible, setClearDialogVisible] = useState(false);

  const dispatch = useAppDispatch();
  const messages = useAppSelector((state) => state.chatbot.messages);
  const userProgress = useAppSelector((state) => state.userProgress.userProgress);
  const conversationId = useAppSelector((state) => state.chatbot.conversationId);

  const [initialized, setInitialized] = useState(false);

  // Load user progress and add initial message when first open or clear
  useEffect(() => {
    if (!initialized) {
      createQuestionTable();
      getUserProgressFromStorage().then((userProgress) => {
        console.log("userProgress", userProgress);
        // Set user progress
        dispatch(setUserProgress(userProgress));
        setInitialized(true);

        // Add loading message
        dispatch(addLoading());
        sendStreamMessage({ level: userProgress.level, target: userProgress.target, conversationId, dispatch });
      });
    } else {
      if (messages.length === 0) {
        // Add loading message when clear
        dispatch(addLoading());
        sendStreamMessage({ level: userProgress.level, target: userProgress.target, conversationId, dispatch });
      }
    }
  }, [initialized, messages.length]);

  const openClearChatDialog = () => setClearDialogVisible(true);
  const clearConversation = () => dispatch(clearChat());

  const handleSend = (message: string) => {
    const data = message.trim();
    const userMessage = createChatMessage({ fullText: data });

    dispatch(addMessage(userMessage));
    dispatch(addLoading());

    sendStreamMessage({
      message: data,
      level: userProgress.level,
      target: userProgress.target,
      conversationId,
      dispatch,
    });
  };

  const handleClickAction = async (actionId: string, title: string) => {
    console.log("action", actionId, ":", title);

    let userLevel = userProgress.level;
    let userTarget = userProgress.target;

    // Set level if found
    if (actionId) {
      switch (actionId[0]) {
        case "l":
          userLevel = `N${actionId[1]}`;
          dispatch(setUserLevel(userLevel));
          break;
        case "t":
          userTarget = `N${actionId[1]}`;
          dispatch(setUserTarget(userTarget));
          break;
      }
    }

    const userMessage = createChatMessage({ fullText: title });

    dispatch(addMessage(userMessage));
    dispatch(addLoading());

    sendStreamMessage({
      message: title,
      actionId: actionId,
      level: userLevel.length > 0 ? userLevel : userProgress.level,
      target: userTarget.length > 0 ? userTarget : userProgress.target,
      conversationId,
      dispatch,
    });
  };

  const handleDevClick = () => {
    const dbPath = `${FileSystem.documentDirectory}/SQLite/`;
    console.log(dbPath);

    clearAllTables();
    dispatch(clearUserProgress());
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
            onDevClick={handleDevClick}
          />
          <ChatMessageList handleClickAction={handleClickAction} />
          <ChatInput onSend={handleSend} />

          <ClearChatDialog
            title="Clear All?"
            message="Are you sure you want to delete all messages?"
            cancelText="Cancel"
            confirmText="Confirm"
            visible={clearDialogVisible}
            setVisible={setClearDialogVisible}
            clearConversation={clearConversation}
          />
        </View>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};
