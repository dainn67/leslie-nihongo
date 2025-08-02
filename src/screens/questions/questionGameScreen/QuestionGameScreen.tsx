import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "../../../app/DrawerNavigator";
import { useTheme } from "../../../theme";
import { AppBar } from "../../../components/AppBar";
import { Ionicons } from "@expo/vector-icons";
import { QuestionView } from "../../chatbot/components/chatBubble/QuestionView";
import { AnimatedProgressBar } from "../../../components/AnimatedProgressBar";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ScrollView } from "react-native-gesture-handler";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import { RootState } from "../../../app/store";
import { resetGame, setCurrentIndex, setSelectedAnswer } from "../../../features/game/gameSlice";
import * as FileSystem from "expo-file-system";
import MainButton from "../../../components/buttons/MainButton";

type QuestionGameScreenRouteProp = RouteProp<RootStackParamList, "QuestionGameScreen">;
type QuestionGameScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "QuestionGameScreen">;

export const QuestionGameScreen = () => {
  const route = useRoute<QuestionGameScreenRouteProp>();
  const { questions } = route.params;

  const { colors } = useTheme();

  const currentIndex = useAppSelector((state: RootState) => state.game.currentIndex);
  const answerMap = useAppSelector((state: RootState) => state.game.selectedAnswers);

  const question = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  const navigation = useNavigation<QuestionGameScreenNavigationProp>();

  const dispatch = useAppDispatch();

  const handleAnswerSelect = (answerId: number) => {
    dispatch(setSelectedAnswer(answerId));
  };

  useEffect(() => {
    dispatch(resetGame());
    dispatch(setCurrentIndex({ index: 0, questionIndex: question.questionId }));
  }, []);

  const handleBookmarkPress = (isBookmarked: boolean) => {};

  const handleDevClick = () => {
    const dbPath = `${FileSystem.documentDirectory}/SQLite/`;
    console.log(dbPath);
  };

  return (
    <View style={[style.container, { backgroundColor: colors.background }]}>
      <AppBar
        title={"Câu hỏi"}
        leftIcon={<Ionicons name="arrow-back" size={24} color="white" />}
        onLeftPress={() => navigation.pop()}
        onDevClick={handleDevClick}
      />
      <View style={style.progressBar}>
        <AnimatedProgressBar progress={progress} />
      </View>
      <ScrollView style={style.questionContainer}>
        <QuestionView
          questionIndex={currentIndex}
          question={question}
          totalQuestions={questions.length}
          selectedAnswer={answerMap[question.questionId]}
          bookmarked={true}
          onAnswerSelect={handleAnswerSelect}
          onBookmarkPress={handleBookmarkPress}
        />
      </ScrollView>
      <View style={style.buttonContainer}>
        <MainButton
          style={style.button}
          title={"Trước"}
          onPress={() => {
            dispatch(setCurrentIndex({ index: currentIndex + 1, questionIndex: question.questionId }));
          }}
        />
        <MainButton
          style={style.button}
          title={"Tiếp"}
          onPress={() => {
            dispatch(setCurrentIndex({ index: currentIndex + 1, questionIndex: question.questionId }));
          }}
        />
      </View>
    </View>
  );
};

const style = StyleSheet.create({
  container: {
    flex: 1,
  },
  progressBar: {
    marginTop: 16,
  },
  questionContainer: {
    flex: 1,
    paddingHorizontal: 16,
    marginTop: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  button: {
    flex: 1,
  },
});
