import React from "react";
import { Provider } from "react-redux";
import { store } from "./src/app/store";
import { RootNavigator } from "./src/app/RootNavigator";
import { useFonts } from "expo-font";
import { ActivityIndicator } from "react-native";

export default function App() {
  const [fontsLoaded] = useFonts({
    "Poppins-Black": require("./assets/fonts/Poppins-Black.ttf"),
    "Poppins-Bold": require("./assets/fonts/Poppins-Bold.ttf"),
    "Poppins-Regular": require("./assets/fonts/Poppins-Regular.ttf"),
    "Poppins-Italic": require("./assets/fonts/Poppins-Italic.ttf"),
  });

  if (!fontsLoaded) return <ActivityIndicator />;

  return (
    <Provider store={store}>
      <RootNavigator />
    </Provider>
  );
}
