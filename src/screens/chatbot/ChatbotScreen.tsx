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
import {
  addLoading,
  addMessage,
  clearChat,
  extractContext,
  getConversationIdByCID,
  getConversationSummaryByCID,
  getMessagesByCID,
} from "../../features/chatbot/chatbotSlice";
import {
  clearUserProgress,
  setUserExamDate,
  setUserLevel,
  setUserProgress,
  setUserTarget,
} from "../../features/userProgress/userProgressSlice";
import { createQuestionTable, deleteAllTables, updateTables } from "../../storage/database/tables";
import { createChatMessage, MessageStatus } from "../../models/chatMessage";
import { getUserProgressFromStorage } from "../../service/userProgressSerivice";
import { MyDatePicker } from "../../components/datePicker/MyDatePicker";
import { convertDateToDDMMYYYY } from "../../utils/utils";
import { loadFromAsyncStorage } from "../../storage/asyncStorage/asyncStorage";
import { AsyncStorageConstants } from "../../storage/asyncStorage/asyncStorateConstant";
import { setTheme } from "../../features/theme/themeSlice";
import { ChatbotService } from "../../service/chatbotService";
import { DrawerParamList } from "../../app/DrawerNavigator";
import { ChatInput } from "./components/ChatInput";
import ClearChatDialog from "./components/ClearChatDialog";
import TTSService from "../../service/ttsService";
import { DiscordService } from "../../service/discordService";

type ChatbotScreenNavigationProp = DrawerNavigationProp<DrawerParamList, "ChatbotScreen">;

export const ChatbotScreen = () => {
  // Drawer
  const navigation = useNavigation<ChatbotScreenNavigationProp>();

  // Clear chat dialog
  const [clearDialogVisible, setClearDialogVisible] = useState(false);

  const dispatch = useAppDispatch();
  const messages = useAppSelector((state) => getMessagesByCID(state.chatbot));
  const conversationId = useAppSelector((state) => getConversationIdByCID(state.chatbot));
  const conversationSummary = useAppSelector((state) => getConversationSummaryByCID(state.chatbot));

  const userProgress = useAppSelector((state) => state.userProgress.userProgress);
  const isGenerating = ![MessageStatus.DONE, MessageStatus.ERROR].includes(messages[messages.length - 1]?.status);

  const [initialized, setInitialized] = useState(false);
  const [datePickerVisible, setDatePickerVisible] = useState(false);

  // Load user progress and add initial message when first open or clear
  useEffect(() => {
    if (!initialized) {
      createQuestionTable();
      updateTables();
      TTSService.init();
      getUserProgressFromStorage().then((userProgress) => {
        // Set user progress
        dispatch(setUserProgress(userProgress));
        setInitialized(true);

        // Add loading message
        dispatch(addLoading({}));
        ChatbotService.sendStreamMessage({
          messages: messages,
          level: userProgress.level,
          target: userProgress.target,
          examDate: userProgress.examDate,
          conversationSummary,
          conversationId,
          dispatch,
        });
      });

      loadFromAsyncStorage(AsyncStorageConstants.THEME_MODE).then((scheme) => {
        dispatch(setTheme(scheme));
      });
    } else if (messages.length === 0) {
      // Add loading message when clear
      dispatch(addLoading({}));
      ChatbotService.sendStreamMessage({
        messages: messages,
        level: userProgress.level,
        target: userProgress.target,
        examDate: userProgress.examDate,
        conversationSummary,
        conversationId,
        dispatch,
      });
    }
  }, [initialized, messages.length]);

  const handleSend = (message: string) => {
    const data = message.trim();
    const userMessage = createChatMessage({ fullText: data });

    dispatch(addMessage({ message: userMessage }));
    dispatch(addLoading({}));

    ChatbotService.sendStreamMessage({
      message: data,
      messages: messages,
      level: userProgress.level,
      target: userProgress.target,
      examDate: userProgress.examDate,
      conversationSummary,
      conversationId,
      dispatch,
    });

    dispatch(extractContext({ message, conversationSummary }));
  };

  const handleClickAction = async (title: string, actionId?: string) => {
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
        dispatch(addMessage({ message: userMessage }));
        dispatch(addLoading({}));

        ChatbotService.sendStreamMessage({
          messages: messages,
          actionId: actionId,
          level: userLevel,
          target: userTarget,
          examDate: 0,
          conversationSummary,
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

    dispatch(addMessage({ message: userMessage }));
    dispatch(addLoading({}));

    ChatbotService.sendStreamMessage({
      message: title,
      messages: messages,
      actionId: actionId,
      level: userLevel.length > 0 ? userLevel : userProgress.level,
      target: userTarget.length > 0 ? userTarget : userProgress.target,
      examDate: userProgress.examDate,
      conversationSummary,
      conversationId,
      dispatch,
    });

    dispatch(extractContext({ message: title, conversationSummary }));
  };

  const handleSelectExamDate = (selectedDate: Date | undefined) => {
    if (!selectedDate) return;

    const dateString = convertDateToDDMMYYYY(selectedDate);

    dispatch(setUserExamDate(selectedDate.getTime()));

    const userMessage = createChatMessage({ fullText: dateString });
    dispatch(addMessage({ message: userMessage }));
    dispatch(addLoading({}));

    ChatbotService.sendStreamMessage({
      messages: messages,
      level: userProgress.level,
      target: userProgress.target,
      examDate: selectedDate.getTime(),
      conversationSummary,
      conversationId,
      dispatch,
    });
  };

  const handleAnalyze = (summary: string) => {
    setTimeout(() => {
      dispatch(addLoading({}));

      ChatbotService.sendStreamMessage({
        message: summary,
        messages: messages,
        level: userProgress.level,
        target: userProgress.target,
        examDate: userProgress.examDate,
        analyzeChatGame: true,
        conversationSummary,
        conversationId,
        dispatch,
      });
    }, 1000);
  };

  const clearConversation = () => dispatch(clearChat({}));

  const handleDevClick = () => {
    // const dbPath = `${FileSystem.documentDirectory}/SQLite/`;
    // console.log(dbPath);
    // deleteAllTables();
    // dispatch(clearUserProgress());
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {/* Main chatbot screen */}
      <View style={{ flex: 1 }}>
        <AppBar
          title={AppConfig.name}
          leftIcon={<Ionicons name="menu" size={24} color="white" />}
          rightIcon={<Ionicons name="trash" size={24} color="white" />}
          onLeftPress={() => navigation.openDrawer()}
          onRightPress={() => setClearDialogVisible(true)}
          onDevClick={handleDevClick}
        />
        <ChatMessageList messages={messages} onClickAction={handleClickAction} onAnalyze={handleAnalyze} />
        <ChatInput disable={isGenerating} onSend={handleSend} />

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
