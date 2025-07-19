import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { useTheme } from "../theme";

interface AppBarProps {
  title: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onLeftPress?: () => void;
  onRightPress?: () => void;
}

export const AppBar: React.FC<AppBarProps> = ({
  title,
  leftIcon,
  rightIcon,
  onLeftPress,
  onRightPress,
}) => {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={{ backgroundColor: colors.primary }}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.iconContainer} onPress={onLeftPress}>
          {leftIcon}
        </TouchableOpacity>

        <Text style={styles.title}>{title}</Text>

        <TouchableOpacity style={styles.iconContainer} onPress={onRightPress}>
          {rightIcon}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
    paddingHorizontal: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    flex: 1,
    fontSize: 20,
    color: "#FFFFFF",
    fontWeight: "bold",
    textAlign: "center",
  },
});
