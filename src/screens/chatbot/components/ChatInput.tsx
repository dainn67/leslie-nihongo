import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TextInput as GestureTextInput } from "react-native-gesture-handler";
import { useTheme } from "../../../theme";
import { AppConfig } from "../../../constants/appConfig";

interface ChatInputProps {
  onSend: (message: string) => void;
}

const ChatInput = ({ onSend }: ChatInputProps) => {
  const [message, setMessage] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const { colors } = useTheme();

  const styles = getStyles(isFocused, message, colors);

  const handleSend = () => {
    if (message.trim()) {
      onSend(message);
      setMessage("");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ backgroundColor: colors.background }}
      keyboardVerticalOffset={0}
    >
      <SafeAreaView style={{ backgroundColor: colors.background }}>
        <View style={styles.inputContainer}>
          <View style={styles.inputBox}>
            <View style={styles.iconContainer}>
              <Ionicons name="chatbubble-outline" size={18} color={colors.textSecondary} />
            </View>
            <GestureTextInput
              style={styles.textInput}
              placeholder="Ask anything..."
              placeholderTextColor={colors.textTertiary}
              value={message}
              onSubmitEditing={handleSend}
              onChangeText={setMessage}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              multiline
              maxLength={500}
            />
            {message.length > 0 && (
              <TouchableOpacity
                style={styles.clearButton}
                onPress={() => setMessage("")}
                activeOpacity={0.7}
              >
                <Ionicons name="close-circle" size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity
            style={styles.sendButton}
            disabled={message.length === 0}
            onPress={handleSend}
            activeOpacity={0.8}
          >
            <Ionicons
              name="send"
              size={18}
              color={message.length > 0 ? "white" : colors.textTertiary}
            />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const getStyles = (isFocused: boolean, message: string, colors: any) =>
  StyleSheet.create({
    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingVertical: 16,
      backgroundColor: colors.background,
      borderTopWidth: 1,
      borderTopColor: colors.borderLight,
      shadowColor: colors.cardShadow,
      shadowOffset: {
        width: 0,
        height: -4,
      },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 8,
    },
    inputBox: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.backgroundSecondary,
      borderRadius: 28,
      paddingHorizontal: 4,
      paddingVertical: 4,
      borderWidth: 2,
      borderColor: isFocused ? colors.primary : colors.borderLight,
      shadowColor: colors.cardShadow,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 3,
    },
    iconContainer: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: colors.backgroundTertiary,
      justifyContent: "center",
      alignItems: "center",
      marginLeft: 4,
    },
    textInput: {
      flex: 1,
      fontSize: 16,
      color: colors.text,
      paddingHorizontal: 12,
      paddingVertical: 8,
      maxHeight: 100,
      fontFamily: AppConfig.fontFamily,
    },
    clearButton: {
      width: 32,
      height: 32,
      borderRadius: 16,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 4,
    },
    sendButton: {
      marginLeft: 12,
      backgroundColor: message.length > 0 ? colors.primary : colors.backgroundTertiary,
      width: 48,
      height: 48,
      borderRadius: 24,
      justifyContent: "center",
      alignItems: "center",
      shadowColor: colors.primary,
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: message.length > 0 ? 0.3 : 0,
      shadowRadius: 6,
      elevation: message.length > 0 ? 4 : 0,
    },
  });

export default ChatInput;
