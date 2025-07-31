import React from "react";
import { Modal, TouchableOpacity, View, StyleSheet, Dimensions } from "react-native";
import { useTheme } from "../../../theme";
import { Ionicons } from "@expo/vector-icons";
import { CustomText } from "../../../components/text/customText";

interface ClearChatDialogProps {
  title: string;
  message: string;
  cancelText: string;
  confirmText: string;
  visible: boolean;
  setVisible: (visible: boolean) => void;
  onClearConversation: () => void;
}

export const ClearChatDialog = ({ title, message, cancelText, confirmText, visible, setVisible, onClearConversation }: ClearChatDialogProps) => {
  const { colors } = useTheme();

  const handleConfirm = () => {
    onClearConversation();
    setVisible(false);
  };

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={() => setVisible(false)}>
      <View style={[styles.overlay, { backgroundColor: colors.overlay }]}>
        <View style={[styles.dialog, { backgroundColor: colors.card, shadowColor: colors.cardShadow }]}>
          <View style={styles.iconContainer}>
            <Ionicons name="trash" size={32} color={colors.error} />
          </View>

          <CustomText weight="Bold" style={[styles.title, { color: colors.text }]}>
            {title}
          </CustomText>
          <CustomText weight="Regular" style={[styles.message, { color: colors.textSecondary }]}>
            {message}
          </CustomText>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton, { backgroundColor: colors.backgroundSecondary }]}
              onPress={() => setVisible(false)}
              activeOpacity={0.8}
            >
              <CustomText weight="Regular" style={[styles.cancelText, { color: colors.textSecondary }]}>
                {cancelText}
              </CustomText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.confirmButton, { backgroundColor: colors.error }]}
              onPress={handleConfirm}
              activeOpacity={0.8}
            >
              <CustomText weight="Regular" style={[styles.confirmText, { color: "white" }]}>
                {confirmText}
              </CustomText>
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
    fontWeight: "bold",
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
