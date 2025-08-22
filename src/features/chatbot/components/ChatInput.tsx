import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, TouchableOpacity, View, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TextInput as GestureTextInput } from 'react-native-gesture-handler';
import { useAppTheme } from '../../../theme';
import { AppConfig } from '../../../constants/appConfig';

interface ChatInputProps {
  disable?: boolean;
  placeHolderText?: string;
  onSend: (message: string) => void;
}

export const ChatInput = ({ disable, placeHolderText, onSend }: ChatInputProps) => {
  const [message, setMessage] = useState('');
  const { colors } = useAppTheme();

  const styles = getStyles(message, colors);

  const handleSend = () => {
    if (message.trim() && !disable) {
      onSend(message);
      setMessage('');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ backgroundColor: colors.background }}
      keyboardVerticalOffset={0}
    >
      <SafeAreaView>
        <View style={styles.inputContainer}>
          <View style={[styles.inputBox, disable && styles.inputBoxDisabled]}>
            <View style={styles.iconContainer}>
              <Ionicons name="chatbubble-outline" size={18} color={colors.textOnPrimary} />
            </View>
            <GestureTextInput
              style={[styles.textInput, disable && styles.textInputDisabled]}
              placeholder={(placeHolderText ?? disable) ? 'Đang suy nghĩ ...' : 'Nhập câu hỏi'}
              placeholderTextColor={colors.placeholder}
              value={message}
              onSubmitEditing={handleSend}
              onChangeText={setMessage}
              multiline
              maxLength={500}
              editable={!disable}
              selectTextOnFocus={!disable}
            />
            {message.length > 0 && !disable && (
              <TouchableOpacity style={styles.clearButton} onPress={() => setMessage('')} activeOpacity={0.7}>
                <Ionicons name="close-circle" size={20} color={colors.text} />
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity
            style={[styles.sendButton, (message.length === 0 || disable) && styles.sendButtonDisabled]}
            disabled={message.length === 0 || disable}
            onPress={handleSend}
            activeOpacity={0.8}
          >
            <Ionicons name="send" size={18} color={message.length > 0 && !disable ? colors.text : colors.placeholder} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const getStyles = (message: string, colors: any) =>
  StyleSheet.create({
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderTopWidth: 0.5,
      borderColor: colors.placeholder,
    },
    inputBox: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.background,
      borderRadius: 28,
      paddingHorizontal: 4,
      paddingVertical: 4,
      borderWidth: 1,
      borderColor: colors.secondary,
    },
    inputBoxDisabled: {
      opacity: 0.6,
    },
    iconContainer: {
      width: 36,
      height: 36,
      borderRadius: 100,
      backgroundColor: colors.secondary,
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: 4,
    },
    textInput: {
      flex: 1,
      fontSize: 16,
      color: colors.placeholder,
      paddingHorizontal: 12,
      paddingVertical: 8,
      maxHeight: 100,
      fontFamily: AppConfig.fontFamily,
    },
    textInputDisabled: {
      color: colors.placeholder,
    },
    clearButton: {
      width: 32,
      height: 32,
      borderRadius: 16,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 4,
    },
    sendButton: {
      marginLeft: 12,
      backgroundColor: message.length > 0 ? colors.secondary : colors.secondary,
      width: 48,
      height: 48,
      borderRadius: 24,
      justifyContent: 'center',
      alignItems: 'center',
    },
    sendButtonDisabled: {
      backgroundColor: colors.secondary,
    },
  });
