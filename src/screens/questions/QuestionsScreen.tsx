import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AppBar } from "../../components/AppBar";
import { Ionicons } from "@expo/vector-icons";
import { QuestionCategoryGrid } from "./components/QuestionCategoryGrid";
import { useNavigation } from "@react-navigation/native";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { DrawerParamList } from "../chatbot/ChatbotScreen";

export const QuestionsScreen = () => {
  const navigation = useNavigation<DrawerNavigationProp<DrawerParamList, "Questions">>();
  const openDrawer = () => navigation.openDrawer();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppBar
        title={"Questions"}
        leftIcon={<Ionicons name="menu" size={24} color="white" />}
        rightIcon={<Ionicons name="search" size={24} color="white" />}
        onLeftPress={openDrawer}
        onRightPress={() => {}}
        onDevClick={() => {}}
      />
      <QuestionCategoryGrid />
    </GestureHandlerRootView>
  );
};
