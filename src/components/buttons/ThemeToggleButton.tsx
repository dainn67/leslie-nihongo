import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import { RootState } from "../../app/store";
import { toggleTheme } from "../../features/theme/themeSlice";
import { useAppTheme } from "../../theme";
import { CustomText } from "../text/customText";

export const ThemeToggleButton = () => {
  const dispatch = useDispatch();
  const themeMode = useSelector((state: RootState) => state.theme.mode);
  const { colors, isDarkMode } = useAppTheme();

  const handleToggle = () => {
    dispatch(toggleTheme());
  };

  const getIconName = () => {
    if (themeMode === "system") {
      return isDarkMode ? "moon" : "sunny";
    }
    return themeMode === "dark" ? "moon" : "sunny";
  };

  const getLabel = () => {
    if (themeMode === "system") {
      return isDarkMode ? "Dark Mode" : "Light Mode";
    }
    return themeMode === "dark" ? "Dark Mode" : "Light Mode";
  };

  return (
    <TouchableOpacity style={styles.button} onPress={handleToggle}>
      <Ionicons name={getIconName()} size={24} color={colors.primary} style={styles.icon} />
      <CustomText style={[styles.label, { color: colors.text }]}>{getLabel()}</CustomText>
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
