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
  setUserProgress,
  updateUserProgress,
} from "../../features/userProgress/userProgressSlice";
import { createQuestionTable, deleteAllTables, updateTables } from "../../storage/database/tables";
import { createChatMessage, MessageStatus } from "../../models/chatMessage";
import { UserProgressService } from "../../service/userProgressSerivice";
import { MyDatePicker } from "../../components/datePicker/MyDatePicker";
import { convertDateToDDMMYYYY, normalizeDate } from "../../utils/utils";
import { loadFromAsyncStorage, logAllAsyncStorage } from "../../storage/asyncStorage/asyncStorage";
import { AsyncStorageConstants } from "../../storage/asyncStorage/asyncStorateConstant";
import { setTheme } from "../../features/theme/themeSlice";
import { ChatbotService } from "../../service/chatbotService";
import { DrawerParamList } from "../../app/DrawerNavigator";
import { ChatInput } from "./components/ChatInput";
import ClearChatDialog from "./components/ClearChatDialog";
import TTSService from "../../service/ttsService";
import { createTmpUserProgress } from "../../models/userProgress";

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
      UserProgressService.getUserProgressFromStorage().then((userProgress) => {
        // Set user progress
        dispatch(setUserProgress(userProgress));
        setInitialized(true);

        // Add loading message
        dispatch(addLoading({}));
        ChatbotService.sendStreamMessage({
          messages: messages,
          userProgress: userProgress,
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
        userProgress: userProgress,
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
      conversationSummary,
      conversationId,
      userProgress: userProgress,
      dispatch,
    });

    dispatch(extractContext({ message }));
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
        dispatch(updateUserProgress({ examDate: 0 }));
        const userMessage = createChatMessage({ fullText: title });
        dispatch(addMessage({ message: userMessage }));
        dispatch(addLoading({}));

        ChatbotService.sendStreamMessage({
          messages: messages,
          actionId: actionId,
          userProgress: createTmpUserProgress(userProgress, { level: userLevel, target: userTarget, examDate: 0 }),
          conversationSummary,
          conversationId,
          dispatch,
        });

        return;
      } else if (actionId.startsWith(setLevelActionId)) {
        userLevel = actionId[1] == '5' ? 'Beginner' : `N${actionId[1]}`;
        dispatch(updateUserProgress({ level: userLevel }));
      } else if (actionId.startsWith(setTargetActionId)) {
        userTarget = `N${actionId[1]}`;
        dispatch(updateUserProgress({ target: userTarget }));
      }
    }

    const userMessage = createChatMessage({ fullText: title });

    dispatch(addMessage({ message: userMessage }));
    dispatch(addLoading({}));

    ChatbotService.sendStreamMessage({
      message: title,
      messages: messages,
      actionId: actionId,
      userProgress: createTmpUserProgress(
        userProgress,
        {
          level: userLevel.length > 0 ? userLevel : userProgress.level,
          target: userTarget.length > 0 ? userTarget : userProgress.target,
        }
      ),
      conversationSummary,
      conversationId,
      dispatch,
    });

    dispatch(extractContext({ message: title }));
  };

  const handleSelectExamDate = (selectedDate: Date | undefined) => {
    if (!selectedDate) return;

    const dateString = convertDateToDDMMYYYY(selectedDate);

    dispatch(updateUserProgress({ examDate: selectedDate.getTime() }));

    const userMessage = createChatMessage({ fullText: dateString });
    dispatch(addMessage({ message: userMessage }));
    dispatch(addLoading({}));

    ChatbotService.sendStreamMessage({
      messages: messages,
      userProgress: createTmpUserProgress(userProgress, { examDate: selectedDate.getTime() }),
      conversationSummary,
      conversationId,
      dispatch,
    });
  };

  const handleAnalyze = (summary: string) => {
    setTimeout(() => {
      dispatch(addLoading({}));

      // Analyze chat game
      ChatbotService.sendStreamMessage({
        message: summary,
        messages: messages,
        userProgress: userProgress,
        analyzeChatGame: true,
        conversationSummary,
        conversationId,
        dispatch,
      });

      // Analyze overtime progress
      ChatbotService.sendMessage({
        message: summary,
        type: 'analyze_progress',
        data: {
          level: userProgress.level,
          target: userProgress.target,
          exam_date: userProgress.examDate ? convertDateToDDMMYYYY(userProgress.examDate) : "",
          prev_analytic: userProgress.analytic[normalizeDate(new Date())],
          current_date: convertDateToDDMMYYYY(new Date()),
        },
      }).then((result) => {
        dispatch(updateUserProgress({ analytic: result }));
      });
    }, 1000);
  };

  const clearConversation = () => dispatch(clearChat({}));

  const handleDevClick = () => {
    // deleteAllTables();
    // dispatch(clearUserProgress());
    // logAllAsyncStorage();
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
