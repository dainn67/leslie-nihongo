import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AppBar } from "../../../components/AppBar";
import { Ionicons } from "@expo/vector-icons";
import { QuestionCategoryGrid } from "./components/QuestionCategoryGrid";
import { useNavigation } from "@react-navigation/native";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { DrawerParamList } from "../../chatbot/ChatbotScreen";
import { QuestionType } from "../../../models/question";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../app/DrawerNavigator";
import { getAllQuestions } from "../../../storage/database/tables";
import { useAppDispatch } from "../../../hooks/hooks";
import { setQuestions } from "../../../features/questions/questionSlice";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "QuestionListScreen">;

export const QuestionsScreen = () => {
  const drawerNavigation = useNavigation<DrawerNavigationProp<DrawerParamList, "QuestionsScreen">>();
  const openDrawer = () => drawerNavigation.openDrawer();

  const navigation = useNavigation<NavigationProp>();
  const handleNavigateToQuestionType = (type: QuestionType) => {
    navigation.navigate("QuestionListScreen", { type });
  };

  const dispatch = useAppDispatch();

  useEffect(() => {
    const allQuestions = getAllQuestions();
    dispatch(setQuestions(allQuestions));
  });

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppBar
        title={"Câu hỏi"}
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
