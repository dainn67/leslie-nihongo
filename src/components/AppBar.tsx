import React from "react";
import { View, StyleSheet, TouchableOpacity, SafeAreaView } from "react-native";
import { useAppTheme } from "../theme";
import { CustomText } from "./text/customText";
import { IconButton } from "./buttons";
import { AppIcons } from "../constants/appIcons";

interface AppBarProps {
  title: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onLeftPress?: () => void;
  onRightPress?: () => void;
  onDevClick?: () => void;
}

export const AppBar: React.FC<AppBarProps> = ({ title, leftIcon, rightIcon, onLeftPress, onRightPress, onDevClick }) => {
  const { colors, isDarkMode } = useAppTheme();

  return (
    <SafeAreaView style={{ backgroundColor: colors.primary }}>
      <View style={[styles.container, { backgroundColor: colors.primary }]}>
        {leftIcon ? (
          <TouchableOpacity
            style={[
              styles.iconContainer,
              styles.iconButton,
              { backgroundColor: isDarkMode ? "rgba(255, 255, 255, 0.15)" : "rgba(255, 255, 255, 0.3)" },
            ]}
            onPress={onLeftPress}
            activeOpacity={0.7}
          >
            {leftIcon}
          </TouchableOpacity>
        ) : (
          <View style={styles.iconContainer} />
        )}

        <View style={styles.titleContainer}>
          <CustomText weight="Bold" style={[styles.title, { color: isDarkMode ? colors.text : "#4A4A4A" }]}>
            {title}
          </CustomText>
        </View>

        {rightIcon ? (
          <TouchableOpacity
            style={[
              styles.iconContainer,
              styles.iconButton,
              { backgroundColor: isDarkMode ? "rgba(255, 255, 255, 0.15)" : "rgba(255, 255, 255, 0.3)" },
            ]}
            onPress={onRightPress}
            activeOpacity={0.7}
          >
            {rightIcon}
          </TouchableOpacity>
        ) : (
          <View style={styles.iconContainer} />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  gradient: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  iconContainer: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  iconButton: {
    borderRadius: 22,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  titleContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  iconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  title: {
    fontSize: 22,
    color: "#FFFFFF",
    fontWeight: "bold",
    textAlign: "center",
    letterSpacing: 0.5,
  },
});
