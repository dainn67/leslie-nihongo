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
import { AppConfig } from "../../config/appConfig";
import ClearChatDialog from "./components/ClearChatDialog";
import { addLoading, addMessage, clearChat } from "../../features/chatbot/chatMessageList/chatbotSlice";
import ChatInput from "./components/ChatInput";
import { setUserLevel, setUserProgress, setUserTarget } from "../../features/userProgress/userProgressSlice";
import { createQuestionTable, getAllQuestions } from "../../storage/database/tables/questionTable";
import * as FileSystem from "expo-file-system";
import { createChatMessage } from "../../models/chatMessage";
import { sendStreamMessage } from "../../features/chatbot/chatMessageStream/chatMessageAPI";
import { getUserProgressFromStorage } from "../../service/userProgressSerivice";

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

  const [initialized, setInitialized] = useState(false);

  // Load user progress and add initial message when first open or clear
  useEffect(() => {
    if (!initialized) {
      getUserProgressFromStorage().then((userProgress) => {
        // Set user progress
        dispatch(setUserProgress(userProgress));
        setInitialized(true);

        // Add loading message
        dispatch(addLoading());
        sendStreamMessage({ message: "<init>", dispatch, level: userProgress.level, target: userProgress.target });
      });
    } else {
      if (messages.length === 0) {
        // Add loading message when clear
        dispatch(addLoading());
        sendStreamMessage({ message: "<init>", dispatch, level: userProgress.level, target: userProgress.target });
      }
    }
  }, [initialized, messages.length]);

  const handleSend = (message: string) => {
    const data = message.trim();
    const userMessage = createChatMessage({ fullText: data });

    dispatch(addMessage(userMessage));
    dispatch(addLoading());

    sendStreamMessage({
      message: data,
      dispatch,
      level: userProgress.level,
      target: userProgress.target,
    });
  };

  const handleClickAction = async (actionId: string, title: string) => {
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
      dispatch,
      level: userLevel.length > 0 ? userLevel : userProgress.level,
      target: userTarget.length > 0 ? userTarget : userProgress.target,
    });
  };

  const openClearChatDialog = () => {
    setClearDialogVisible(true);
  };

  const clearConversation = () => {
    dispatch(clearChat());
  };

  const handleDevClick = () => {
    createQuestionTable();

    const dbPath = `${FileSystem.documentDirectory}/SQLite/`;

    console.log(dbPath);

    // insertQuestions([
    //   {
    //     id: "1",
    //     question: "What is the capital of France?",
    //     explanation: "Paris is the capital of France",
    //     answers: [
    //       { text: "Paris", isCorrect: true },
    //       { text: "London", isCorrect: false },
    //       { text: "Berlin", isCorrect: false },
    //       { text: "Madrid", isCorrect: false },
    //     ],
    //   },
    //   {
    //     id: "2",
    //     question: "What is the capital of Germany?",
    //     explanation: "Berlin is the capital of Germany",
    //     answers: [
    //       { text: "Berlin", isCorrect: true },
    //       { text: "Paris", isCorrect: false },
    //       { text: "London", isCorrect: false },
    //       { text: "Madrid", isCorrect: false },
    //     ],
    //   },
    //   {
    //     id: "3",
    //     question: "What is the capital of Italy?",
    //     explanation: "Rome is the capital of Italy",
    //     answers: [
    //       { text: "Rome", isCorrect: true },
    //       { text: "Paris", isCorrect: false },
    //       { text: "London", isCorrect: false },
    //       { text: "Madrid", isCorrect: false },
    //     ],
    //   },
    // ]);

    const questions = getAllQuestions();
    console.log(questions);
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
