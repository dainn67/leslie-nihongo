import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from "react-native";
import { TextInput as GestureTextInput } from "react-native-gesture-handler";
import { useTheme } from "../../../theme";

interface ChatInputProps {
  onSend: (message: string) => void;
}

export const ChatInput = ({ onSend }: ChatInputProps) => {
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
            <Ionicons
              name="chatbubble-outline"
              size={20}
              color={colors.textSecondary}
              style={{ marginRight: 8 }}
            />
            <GestureTextInput
              style={{
                flex: 1,
                fontSize: 16,
                color: colors.text,
                paddingVertical: 4,
              }}
              placeholder="Nhập tin nhắn của bạn..."
              placeholderTextColor={colors.textSecondary}
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
                style={{ marginLeft: 8 }}
                onPress={() => setMessage("")}
              >
                <Ionicons name="close-circle" size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity
            style={styles.sendButton}
            disabled={message.length === 0}
            onPress={handleSend}
          >
            <Ionicons
              name="send"
              size={20}
              color={message.length > 0 ? "white" : colors.textSecondary}
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
      borderTopColor: colors.border,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: -2,
      },
      elevation: 8,
    },
    inputBox: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.background,
      borderRadius: 25,
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderWidth: 1,
      borderColor: isFocused ? colors.primary : colors.border,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    sendButton: {
      marginLeft: 12,
      backgroundColor: message.length > 0 ? colors.primary : colors.border,
      width: 44,
      height: 44,
      borderRadius: 22,
      justifyContent: "center",
      alignItems: "center",
      shadowColor: colors.primary,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: message.length > 0 ? 0.3 : 0,
      shadowRadius: 4,
      elevation: message.length > 0 ? 4 : 0,
    },
  });
