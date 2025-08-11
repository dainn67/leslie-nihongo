import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { CustomText } from "../text/customText";
import { Ionicons } from "@expo/vector-icons";
import { useAppTheme } from "../../theme";

export const FeedbackButton = () => {
  const { colors } = useAppTheme();

  return (
    <TouchableOpacity style={styles.button}>
      <Ionicons name="chatbubbles" size={24} style={styles.icon} color={colors.primary} />
      <CustomText style={[styles.label, { color: colors.text }]}>Feedback</CustomText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "grey",
  },
  icon: {
    marginRight: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
  },
});
