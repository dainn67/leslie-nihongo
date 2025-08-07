import React, { useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "./src/app/store";
import { RootNavigator } from "./src/app/RootNavigator";
import { useFonts } from "expo-font";
import { ActivityIndicator } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import TTSService from "./src/service/ttsService";

export default function App() {
  const [fontsLoaded] = useFonts({
    "Inter-Black": require("./assets/fonts/inter/Inter-Black.ttf"),
    "Inter-Bold": require("./assets/fonts/inter/Inter-Bold.ttf"),
    "Inter-Regular": require("./assets/fonts/inter/Inter-Regular.ttf"),
    "Inter-Italic": require("./assets/fonts/inter/Inter-Italic.ttf"),
  });

  // Spinner
  if (!fontsLoaded) return <ActivityIndicator />;

  useEffect(() => {
    TTSService.init();
  }, []);

  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <RootNavigator />
      </Provider>
    </SafeAreaProvider>
  );
}
