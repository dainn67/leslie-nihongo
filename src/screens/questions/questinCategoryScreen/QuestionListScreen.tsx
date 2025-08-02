import React, { useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { QuestionType, QuestionTypeTitles } from "../../../models/question";
import { AppBar } from "../../../components/AppBar";
import { Ionicons } from "@expo/vector-icons";
import { RootStackParamList } from "../../../app/DrawerNavigator";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { QuestionView } from "../../chatbot/components/chatBubble/QuestionView";
import { QuestionNumberSelector } from "./components/QuestionNumberSelector";
import { createReviseQuestionSet } from "../../../service/questionService";
import { useAppSelector } from "../../../hooks/hooks";
import MainButton from "../../../components/buttons/MainButton";
import * as FileSystem from "expo-file-system";

type QuestionListScreenRouteProp = RouteProp<RootStackParamList, "QuestionListScreen">;
type QuestionListScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "QuestionListScreen">;

export const QuestionListScreen = () => {
  const navigation = useNavigation<QuestionListScreenNavigationProp>();
  const route = useRoute<QuestionListScreenRouteProp>();

  const { type } = route.params as { type: QuestionType };

  const [amountSelectorVisible, setAmountSelectorVisible] = useState(false);

  const questions = useAppSelector((state) => state.questions.questions).filter((question) => question.type === type);

  const handleSelectQuestion = (amount: number) => {
    const selectedQuestions = createReviseQuestionSet(questions, amount);
    navigation.navigate("QuestionGameScreen", { questions: selectedQuestions });
  };

  return (
    <View style={styles.container}>
      <AppBar
        title={QuestionTypeTitles[type]}
        leftIcon={<Ionicons name="arrow-back" size={24} color="white" />}
        rightIcon={<Ionicons name="search" size={24} color="white" />}
        onLeftPress={() => navigation.pop()}
        onRightPress={() => {
          const dbPath = `${FileSystem.documentDirectory}/SQLite/`;
          console.log(dbPath);
        }}
      />
      <ScrollView style={styles.contentContainer}>
        {questions.map((question, index) => (
          <View key={question.questionId} style={styles.questionContainer}>
            <QuestionView
              question={question}
              questionIndex={index}
              totalQuestions={questions.length}
              selectedAnswer={null}
              bookmarked={true}
            />
          </View>
        ))}
      </ScrollView>
      <MainButton title="Ôn tập" onPress={() => setAmountSelectorVisible(true)} style={styles.buttonContainer} />

      <QuestionNumberSelector
        totalQuestions={questions.length * 10}
        visible={amountSelectorVisible}
        setVisible={setAmountSelectorVisible}
        onSelectQuestion={(amount) => handleSelectQuestion(amount)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  questionContainer: {
    paddingHorizontal: 8,
  },
  buttonContainer: {
    borderRadius: 16,
    margin: 16,
  },
});
