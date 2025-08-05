import { useColorScheme } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../app/store";
import { darkColors, lightColors } from "./colors";

export const useAppTheme = () => {
  const systemScheme = useColorScheme();
  const themeMode = useSelector((state: RootState) => state.theme.mode);

  const getEffectiveScheme = () => {
    if (themeMode === "system") {
      return systemScheme;
    }
    return themeMode;
  };

  const effectiveScheme = getEffectiveScheme();
  const colors = effectiveScheme === "dark" ? darkColors : lightColors;

  return {
    colors,
    isDarkMode: effectiveScheme === "dark",
    themeMode,
  };
};
