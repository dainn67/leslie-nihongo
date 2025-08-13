import React from "react";
import { View, StyleSheet, Modal, TouchableWithoutFeedback, Dimensions, TouchableOpacity } from "react-native";
import { AppConfig } from "../../constants/appConfig";
import { CustomText } from "../text/customText";
import { Ionicons } from "@expo/vector-icons";
import { ChatMessageList } from "../../screens/chatbot/components/ChatMessageList";
import { useAppSelector } from "../../hooks/hooks";
import { MessageStatus } from "../../models/chatMessage";
import ChatInput from "../../screens/chatbot/components/ChatInput";

interface ChatbotBottomSheetProps {
  visible: boolean;
  onClose: () => void;
}

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export const ChatbotBottomSheet: React.FC<ChatbotBottomSheetProps> = ({ visible, onClose }) => {
  const messages = useAppSelector((state) => state.chatbotAssistant.messages);

  const isGenerating = ![MessageStatus.DONE, MessageStatus.ERROR].includes(messages[messages.length - 1]?.status);

  const onClickAction = (title: string, actionId?: string) => {
    console.log(title, actionId);
  };

  const onAnalyze = (summary: string) => {
    console.log(summary);
  };

  const handleSend = (message: string) => {
    console.log(message);
  };

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          {/* Main Content */}
          <View style={styles.bottomSheet}>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.closeButton}>
                <TouchableOpacity onPress={onClose}>
                  <Ionicons name="close" size={24} color="black" />
                </TouchableOpacity>
              </View>
              <View style={styles.titleContainer}>
                <CustomText style={styles.headerText}>Trợ lí {AppConfig.name}</CustomText>
              </View>
            </View>

            {/* Message List */}
            <ChatMessageList messages={messages} onClickAction={onClickAction} onAnalyze={onAnalyze} />

            <ChatInput disable={isGenerating} onSend={handleSend} />
          </View>
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
    padding: 16,
  },
  header: {
    flexDirection: "row",
    height: 40,
    borderBottomColor: "red",
    borderBottomWidth: 0.5,
    position: "relative",
  },
  closeButton: {
    position: "absolute",
    left: 0,
    zIndex: 1,
    height: "100%",
    justifyContent: "center",
  },
  titleContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
});
