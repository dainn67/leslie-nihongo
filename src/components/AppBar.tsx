import React from "react";
import { View, StyleSheet, TouchableOpacity, SafeAreaView } from "react-native";
import { useTheme } from "../theme";
import { Ionicons } from "@expo/vector-icons";
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
  const { colors } = useTheme();

  return (
    <SafeAreaView style={{ backgroundColor: colors.primary }}>
      <View style={styles.container}>
        {leftIcon && (
          <TouchableOpacity style={[styles.iconContainer, styles.iconButton]} onPress={onLeftPress} activeOpacity={0.7}>
            {leftIcon}
          </TouchableOpacity>
        )}

        <View style={styles.titleContainer}>
          <View style={styles.iconWrapper}>
            <Ionicons name="chatbubble" size={20} color="white" />
          </View>
          <CustomText weight="Bold" style={styles.title}>
            {title}
          </CustomText>
        </View>

        {rightIcon && (
          <TouchableOpacity style={[styles.iconContainer, styles.iconButton]} onPress={onRightPress} activeOpacity={0.7}>
            {rightIcon}
          </TouchableOpacity>
        )}

        {__DEV__ && onDevClick && <IconButton icon={AppIcons.dev} onPress={onDevClick} style={{ marginLeft: 10, backgroundColor: "white" }} />}
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
