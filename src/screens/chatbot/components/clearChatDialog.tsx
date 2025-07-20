import React from "react";
import {
  Modal,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useTheme } from "../../../theme";
import { Ionicons } from "@expo/vector-icons";

interface ClearChatDialogProps {
  title: string;
  message: string;
  cancelText: string;
  confirmText: string;
  visible: boolean;
  setVisible: (visible: boolean) => void;
  clearConversation: () => void;
}

export const ClearChatDialog = ({
  title,
  message,
  cancelText,
  confirmText,
  visible,
  setVisible,
  clearConversation,
}: ClearChatDialogProps) => {
  const { colors } = useTheme();

  const handleConfirm = () => {
    clearConversation();
    setVisible(false);
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={() => setVisible(false)}
    >
      <View style={[styles.overlay, { backgroundColor: colors.overlay }]}>
        <View style={[styles.dialog, { backgroundColor: colors.card, shadowColor: colors.cardShadow }]}>
          <View style={styles.iconContainer}>
            <Ionicons name="trash" size={32} color={colors.error} />
          </View>
          
          <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
          <Text style={[styles.message, { color: colors.textSecondary }]}>{message}</Text>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton, { backgroundColor: colors.backgroundSecondary }]}
              onPress={() => setVisible(false)}
              activeOpacity={0.8}
            >
              <Text style={[styles.cancelText, { color: colors.textSecondary }]}>{cancelText}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.confirmButton, { backgroundColor: colors.error }]}
              onPress={handleConfirm}
              activeOpacity={0.8}
            >
              <Text style={styles.confirmText}>{confirmText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  dialog: {
    width: width * 0.85,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 28,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 12,
    textAlign: "center",
    letterSpacing: 0.5,
  },
  message: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 28,
    textAlign: "center",
    letterSpacing: 0.2,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.1)",
  },
  confirmButton: {
    shadowColor: "#ef4444",
  },
  cancelText: {
    fontWeight: "600",
    fontSize: 16,
  },
  confirmText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
});

export default ClearChatDialog;
