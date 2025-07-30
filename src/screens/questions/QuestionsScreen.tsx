import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AppBar } from "../../components/AppBar";
import { Ionicons } from "@expo/vector-icons";
import { QuestionCategoryGrid } from "./components/QuestionCategoryGrid";
import { useNavigation } from "@react-navigation/native";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { DrawerParamList } from "../chatbot/ChatbotScreen";
import { QuestionType } from "../../models/question";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../app/DrawerNavigator";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "QuestionCategoryScreen">;

export const QuestionsScreen = () => {
  const drawerNavigation = useNavigation<DrawerNavigationProp<DrawerParamList, "QuestionsScreen">>();
  const openDrawer = () => drawerNavigation.openDrawer();

  const navigation = useNavigation<NavigationProp>();
  const handleNavigateToQuestionType = (type: QuestionType) => {
    navigation.navigate("QuestionCategoryScreen", { type });
  };

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
      <QuestionCategoryGrid onPress={handleNavigateToQuestionType} />
    </GestureHandlerRootView>
  );
};
