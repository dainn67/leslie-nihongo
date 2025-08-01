import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Question, QuestionType, QuestionTypeTitles } from "../../../models/question";
import { AppBar } from "../../../components/AppBar";
import { Ionicons } from "@expo/vector-icons";
import { RootStackParamList } from "../../../app/DrawerNavigator";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { getQuestionsByType } from "../../../storage/database/tables";
import { QuestionView } from "../../chatbot/components/chatBubble/QuestionView";
import { QuestionNumberSelector } from "./components/QuestionNumberSelector";
import { createReviseQuestionSet } from "../../../service/questionService";
import MainButton from "../../../components/buttons/MainButton";

type QuestionListScreenRouteProp = RouteProp<RootStackParamList, "QuestionListScreen">;
type QuestionListScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "QuestionListScreen">;

export const QuestionListScreen = () => {
  const navigation = useNavigation<QuestionListScreenNavigationProp>();
  const route = useRoute<QuestionListScreenRouteProp>();

  const { type } = route.params as { type: QuestionType };

  const [questions, setQuestions] = useState<Question[]>([]);

  const [amountSelectorVisible, setAmountSelectorVisible] = useState(false);

  useEffect(() => {
    const questions = getQuestionsByType(type);
    setQuestions(questions);
  }, [type]);

  const handleSelectQuestion = (amount: number) => {
    navigation.navigate("QuestionGameScreen", { amount, type });
  };

  return (
    <View style={styles.container}>
      <AppBar
        title={QuestionTypeTitles[type]}
        leftIcon={<Ionicons name="arrow-back" size={24} color="white" />}
        rightIcon={<Ionicons name="search" size={24} color="white" />}
        onLeftPress={() => navigation.pop()}
        onRightPress={() => {}}
      />
      <ScrollView style={styles.contentContainer}>
        {questions.map((question, index) => (
          <View key={question.questionId} style={styles.questionContainer}>
            <QuestionView
              question={question}
              questionIndex={index}
              totalQuestions={questions.length}
              selectedAnswer={null}
              bookmarked={false}
              showExplanation={false}
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
    padding: 8,
  },
  buttonContainer: {
    borderRadius: 16,
    margin: 16,
  },
});
