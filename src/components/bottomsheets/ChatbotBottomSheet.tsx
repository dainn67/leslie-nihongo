import React, { useEffect } from "react";
import { View, StyleSheet, Modal, TouchableWithoutFeedback, Dimensions, TouchableOpacity } from "react-native";
import { AppConfig } from "../../constants/appConfig";
import { CustomText } from "../text/customText";
import { Ionicons } from "@expo/vector-icons";
import { ChatMessageList } from "../../screens/chatbot/components/ChatMessageList";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { createChatMessage, MessageStatus } from "../../models/chatMessage";
import {
  addLoading,
  addMessage,
  getConversationIdByCID,
  getConversationSummaryByCID,
  getLatestMessageByCID,
  getMessagesByCID,
} from "../../features/chatbot/chatbotSlice";
import { ChatbotService } from "../../service/chatbotService";
import { Question } from "../../models/question";
import { ChatInput } from "../../screens/chatbot/components/ChatInput";

interface ChatbotBottomSheetProps {
  visible: boolean;
  question: Question;
  onClose: () => void;
}

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export const ChatbotBottomSheet: React.FC<ChatbotBottomSheetProps> = ({ visible, question, onClose }) => {
  const questionId = question.questionId.toString();

  const messages = useAppSelector((state) => getMessagesByCID(state.chatbot, questionId));
  const latestMessage = useAppSelector((state) => getLatestMessageByCID(state.chatbot, questionId));
  const conversationId = useAppSelector((state) => getConversationIdByCID(state.chatbot, questionId));
  const conversationSummary = useAppSelector((state) => getConversationSummaryByCID(state.chatbot, questionId));

  const isGenerating = latestMessage ? ![MessageStatus.DONE, MessageStatus.ERROR].includes(latestMessage.status) : false;

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (visible && messages.length === 0) {
      dispatch(addLoading({ cid: questionId }));
      ChatbotService.sendStreamMessage({
        message: "Give a hint",
        messages,
        question,
        conversationId,
        conversationSummary,
        dispatch,
      });
    }
  }, [visible, messages.length]);

  const onClickAction = (title: string, actionId?: string) => {
    const userMessage = createChatMessage({ fullText: title });

    dispatch(addMessage({ cid: questionId, message: userMessage }));
    dispatch(addLoading({ cid: questionId }));

    ChatbotService.sendStreamMessage({
      message: title,
      messages,
      question,
      conversationId,
      conversationSummary,
      dispatch,
    });
  };

  const handleSend = (message: string) => {
    const data = message.trim();
    const userMessage = createChatMessage({ fullText: data });

    dispatch(addMessage({ cid: questionId, message: userMessage }));
    dispatch(addLoading({ cid: questionId }));

    ChatbotService.sendStreamMessage({
      message: data,
      messages,
      question,
      conversationId,
      conversationSummary,
      dispatch,
    });
  };

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          {/* Main Content */}
          <TouchableWithoutFeedback>
            <View style={styles.bottomSheet}>
              {/* Header */}
              <View style={styles.header}>
                <View style={styles.closeButton}>
                  <TouchableOpacity onPress={onClose}>
                    <Ionicons name="close" size={24} color="black" />
                  </TouchableOpacity>
                </View>
                <View style={styles.titleContainer}>
                  <CustomText style={styles.headerText}>Trợ lý {AppConfig.name}</CustomText>
                </View>
              </View>

              {/* Message List */}
              <ChatMessageList messages={messages} onClickAction={onClickAction} />

              <ChatInput disable={isGenerating} onSend={handleSend} />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  bottomSheet: {
    backgroundColor: "white",
    height: SCREEN_HEIGHT * 0.9,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  header: {
    flexDirection: "row",
    height: 50,
    borderBottomWidth: 0.5,
    position: "relative",
  },
  closeButton: {
    position: "absolute",
    left: 0,
    zIndex: 1,
    height: "100%",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  titleContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
