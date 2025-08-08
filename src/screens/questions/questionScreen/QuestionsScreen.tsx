import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AppBar } from "../../../components/AppBar";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { DrawerParamList } from "../../chatbot/ChatbotScreen";
import { QuestionType, QuestionTypeTitles } from "../../../models/question";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../app/DrawerNavigator";
import { getAllQuestions } from "../../../storage/database/tables";
import { useAppDispatch } from "../../../hooks/hooks";
import { setQuestions } from "../../../features/questions/questionSlice";
import { Dimensions, StyleSheet, TouchableOpacity, View } from "react-native";
import { useAppTheme } from "../../../theme";
import { CustomText } from "../../../components/text/customText";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "QuestionListScreen">;

export const QuestionsScreen = () => {
  // Drawer & navigation
  const drawerNavigation = useNavigation<DrawerNavigationProp<DrawerParamList, "QuestionsScreen">>();
  const openDrawer = () => drawerNavigation.openDrawer();

  const navigation = useNavigation<NavigationProp>();
  const handleNavigateToQuestionType = (type: QuestionType) => {
    navigation.navigate("QuestionListScreen", { type });
  };

  // UI
  const { colors } = useAppTheme();
  const { width } = Dimensions.get("window");
  const gridItemWidth = (width - 60) / 2;

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
        onLeftPress={openDrawer}
      />
      <View style={[styles.gridContainer, { backgroundColor: colors.background }]}>
        {Object.values(QuestionType).map((type, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.gridItem, { width: gridItemWidth, backgroundColor: colors.backgroundTertiary }]}
            onPress={() => handleNavigateToQuestionType(type)}
          >
            <CustomText key={index} style={{ textAlign: "center", color: colors.text }}>
              {QuestionTypeTitles[type]}
            </CustomText>
          </TouchableOpacity>
        ))}
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  gridContainer: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    padding: 10,
  },
  gridItem: {
    height: 180,
    margin: 10,
    padding: 20,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
