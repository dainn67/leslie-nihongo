import React, { useRef, useState } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "../../../app/DrawerNavigator";
import { useTheme } from "../../../theme";
import { AppBar } from "../../../components/AppBar";
import { Ionicons } from "@expo/vector-icons";
import { QuestionView } from "../../chatbot/components/chatBubble/QuestionView";
import { AnimatedProgressBar } from "../../../components/AnimatedProgressBar";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ScrollView } from "react-native-gesture-handler";

type QuestionGameScreenRouteProp = RouteProp<RootStackParamList, "QuestionGameScreen">;
type QuestionGameScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "QuestionGameScreen">;

export const QuestionGameScreen = () => {
  const route = useRoute<QuestionGameScreenRouteProp>();
  const { questions } = route.params;

  const { colors } = useTheme();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>(Array(questions.length).fill(null));
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState<boolean[]>(Array(questions.length).fill(false));
  const [showExplanations, setShowExplanations] = useState<boolean[]>(Array(questions.length).fill(false));

  const question = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const fadeAnim = useRef(new Animated.Value(1)).current;

  const navigation = useNavigation<QuestionGameScreenNavigationProp>();

  return (
    <View style={[style.container, { backgroundColor: colors.background }]}>
      <AppBar title={"Câu hỏi"} leftIcon={<Ionicons name="arrow-back" size={24} color="white" />} onLeftPress={() => navigation.pop()} />
      <View style={style.progressBar}>
        <AnimatedProgressBar progress={progress} />
      </View>
      <ScrollView style={style.questionContainer}>
        <QuestionView
          questionIndex={currentQuestionIndex}
          question={question}
          totalQuestions={questions.length}
          selectedAnswer={selectedAnswers[currentQuestionIndex]}
          bookmarked={bookmarkedQuestions[currentQuestionIndex]}
          showExplanation={showExplanations[currentQuestionIndex]}
          fadeAnim={fadeAnim}
          onAnswerSelect={(answer) => {}}
          onBookmarkPress={(isBookmarked) => {}}
        />
      </ScrollView>
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
});
