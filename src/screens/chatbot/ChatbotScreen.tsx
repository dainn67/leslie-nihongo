import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppBar } from "../../components/AppBar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ChatMessageList } from "./components/ChatMessageList";
import { useNavigation } from "@react-navigation/native";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { AppConfig } from "../../constants/appConfig";
import { addLoading, addMessage, clearChat } from "../../features/chatbot/chatbotSlice";
import {
  clearUserProgress,
  setUserExamDate,
  setUserLevel,
  setUserProgress,
  setUserTarget,
} from "../../features/userProgress/userProgressSlice";
import { createQuestionTable, deleteAllTables } from "../../storage/database/tables";
import { createChatMessage } from "../../models/chatMessage";
import { sendStreamMessage } from "../../api/chatMessageAPI";
import { getUserProgressFromStorage } from "../../service/userProgressSerivice";
import { createConversationHistory } from "../../service/questionService";
import { MyDatePicker } from "../../components/datePicker/MyDatePicker";
import { convertDateToDDMMYYYY } from "../../utils/utils";
import * as FileSystem from "expo-file-system";
import ChatInput from "./components/ChatInput";
import ClearChatDialog from "./components/ClearChatDialog";

export type DrawerParamList = {
  ChatbotScreen: undefined;
  QuestionsScreen: undefined;
};

type ChatbotScreenNavigationProp = DrawerNavigationProp<DrawerParamList, "ChatbotScreen">;

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
  const [datePickerVisible, setDatePickerVisible] = useState(false);

  // Load user progress and add initial message when first open or clear
  useEffect(() => {
    if (!initialized) {
      createQuestionTable();
      getUserProgressFromStorage().then((userProgress) => {
        // Set user progress
        dispatch(setUserProgress(userProgress));
        setInitialized(true);

        // Add loading message
        dispatch(addLoading());
        sendStreamMessage({
          level: userProgress.level,
          target: userProgress.target,
          examDate: userProgress.examDate,
          conversationId,
          dispatch,
        });
      });
    } else {
      if (messages.length === 0) {
        // Add loading message when clear
        dispatch(addLoading());
        sendStreamMessage({
          level: userProgress.level,
          target: userProgress.target,
          examDate: userProgress.examDate,
          conversationId,
          dispatch,
        });
      }
    }
  }, [initialized, messages.length]);

  const openClearChatDialog = () => setClearDialogVisible(true);
  const clearConversation = () => dispatch(clearChat());

  const handleSend = (message: string) => {
    const data = message.trim();
    const userMessage = createChatMessage({ fullText: data });
    const conversationHistory = createConversationHistory(messages);

    dispatch(addMessage(userMessage));
    dispatch(addLoading());

    sendStreamMessage({
      message: data,
      conversationHistory,
      level: userProgress.level,
      target: userProgress.target,
      examDate: userProgress.examDate,
      conversationId,
      dispatch,
    });
  };

  const handleClickAction = async (title: string, actionId?: string) => {
    // console.log(`action: "${actionId}": ${title}`);

    let userLevel = userProgress.level;
    let userTarget = userProgress.target;

    if (actionId) {
      const setExamDateActionId = "ed1";
      const unknownExamDateActionId = "ed2";
      const setLevelActionId = "l";
      const setTargetActionId = "t";

      if (actionId.startsWith(setExamDateActionId)) {
        setDatePickerVisible(true);
        return;
      } else if (actionId.startsWith(unknownExamDateActionId)) {
        dispatch(setUserExamDate(0));
        const userMessage = createChatMessage({ fullText: title });
        dispatch(addMessage(userMessage));
        dispatch(addLoading());

        sendStreamMessage({
          conversationHistory: createConversationHistory(messages),
          actionId: actionId,
          level: userLevel,
          target: userTarget,
          examDate: 0,
          conversationId,
          dispatch,
        });

        return;
      } else if (actionId.startsWith(setLevelActionId)) {
        userLevel = `N${actionId[1]}`;
        dispatch(setUserLevel(userLevel));
      } else if (actionId.startsWith(setTargetActionId)) {
        userTarget = `N${actionId[1]}`;
        dispatch(setUserTarget(userTarget));
      }
    }

    const userMessage = createChatMessage({ fullText: title });
    const conversationHistory = createConversationHistory(messages);

    dispatch(addMessage(userMessage));
    dispatch(addLoading());

    sendStreamMessage({
      message: title,
      conversationHistory,
      actionId: actionId,
      level: userLevel.length > 0 ? userLevel : userProgress.level,
      target: userTarget.length > 0 ? userTarget : userProgress.target,
      examDate: userProgress.examDate,
      conversationId,
      dispatch,
    });
  };

  const handleSelectExamDate = (selectedDate: Date | undefined) => {
    if (!selectedDate) return;

    const dateString = convertDateToDDMMYYYY(selectedDate);

    dispatch(setUserExamDate(selectedDate.getTime()));

    const userMessage = createChatMessage({ fullText: dateString });
    dispatch(addMessage(userMessage));
    dispatch(addLoading());

    sendStreamMessage({
      conversationHistory: createConversationHistory(messages),
      level: userProgress.level,
      target: userProgress.target,
      examDate: selectedDate.getTime(),
      conversationId,
      dispatch,
    });
  };

  const handleDevClick = () => {
    const dbPath = `${FileSystem.documentDirectory}/SQLite/`;
    console.log(dbPath);

    // deleteAllTables();
    // dispatch(clearUserProgress());

    // console.log(userProgress);
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {/* Main chatbot screen */}
      <View style={{ flex: 1 }}>
        <AppBar
          title={AppConfig.name}
          leftIcon={<Ionicons name="menu" size={24} color="white" />}
          rightIcon={<Ionicons name="trash" size={24} color="white" />}
          onLeftPress={openDrawer}
          onRightPress={openClearChatDialog}
          onDevClick={handleDevClick}
        />
        <ChatMessageList messages={messages} handleClickAction={handleClickAction} />
        <ChatInput onSend={handleSend} />

        <ClearChatDialog
          title="Xoá hội thoại?"
          message="Bạn có muốn xoá và tạo đoạn hội thoại mới?"
          cancelText="Huỷ"
          confirmText="Xác nhận"
          visible={clearDialogVisible}
          setVisible={setClearDialogVisible}
          onClearConversation={clearConversation}
        />
      </View>

      {/* Date picker to set exam date if not set */}
      <MyDatePicker
        visible={datePickerVisible}
        setVisible={setDatePickerVisible}
        date={userProgress.examDate ? new Date(userProgress.examDate) : new Date()}
        handleChange={handleSelectExamDate}
      />
    </GestureHandlerRootView>
  );
};
