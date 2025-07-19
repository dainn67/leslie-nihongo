import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";
import { AppBar } from "../../components/AppBar";
import { ChatInput } from "./components/chatInput";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ChatMessageList } from "./components/chatMessageList";
import { useNavigation } from "@react-navigation/native";
import { DrawerNavigationProp } from "@react-navigation/drawer";

type DrawerParamList = {
  Chatbot: undefined;
  Counter: undefined;
};

type ChatbotScreenNavigationProp = DrawerNavigationProp<DrawerParamList, 'Chatbot'>;

export const ChatbotScreen = () => {
  const navigation = useNavigation<ChatbotScreenNavigationProp>();

  const openDrawer = () => {
    navigation.openDrawer();
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <View style={{ flex: 1 }}>
          <AppBar
            title="Compari"
            leftIcon={<Ionicons name="menu" size={24} color="white" />}
            rightIcon={<Ionicons name="settings" size={24} color="white" />}
            onLeftPress={openDrawer}
            onRightPress={() => {}}
          />
          <ChatMessageList />
          <ChatInput />
        </View>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};
