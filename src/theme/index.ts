import { useColorScheme } from "react-native";
import { darkColors, lightColors } from "./colors";

export const useTheme = () => {
  const scheme = useColorScheme();

  const colors = scheme === "dark" ? darkColors : lightColors;

  return {
    colors,
    isDarkMode: scheme === "dark",
  };
};
