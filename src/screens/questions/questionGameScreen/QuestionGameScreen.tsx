import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { createReviseQuestionSet } from "../../../service/questionService";
import { RouteProp, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "../../../app/DrawerNavigator";
import { useTheme } from "../../../theme";
import { AppBar } from "../../../components/AppBar";
import { Ionicons } from "@expo/vector-icons";

type QuestionGameScreenRouteProp = RouteProp<RootStackParamList, "QuestionGameScreen">;

export const QuestionGameScreen = () => {
  const route = useRoute<QuestionGameScreenRouteProp>();
  const { amount, type } = route.params;

  const { colors } = useTheme();

  useEffect(() => {
    const questionSet = createReviseQuestionSet(amount, type);
    console.log(questionSet);
  }, []);

  return (
    <View style={[style.container, { backgroundColor: colors.background }]}>
      <AppBar title={"Câu hỏi"} leftIcon={<Ionicons name="arrow-back" size={24} color="white" />} onLeftPress={() => {}} />
    </View>
  );
};

const style = StyleSheet.create({
  container: {
    flex: 1,
  },
});
