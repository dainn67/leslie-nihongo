import React from "react";
import { Provider } from "react-redux";
import { store } from "./src/app/store";
import { RootNavigator } from "./src/app/RootNavigator";
import { useFonts } from "expo-font";
import { ActivityIndicator } from "react-native";

export default function App() {
  const [fontsLoaded] = useFonts({
    "Inter-Black": require("./assets/fonts/inter/Inter-Black.ttf"),
    "Inter-Bold": require("./assets/fonts/inter/Inter-Bold.ttf"),
    "Inter-Regular": require("./assets/fonts/inter/Inter-Regular.ttf"),
    "Inter-Italic": require("./assets/fonts/inter/Inter-Italic.ttf"),
  });

  if (!fontsLoaded) return <ActivityIndicator />;

  return (
    <Provider store={store}>
      <RootNavigator />
    </Provider>
  );
}
