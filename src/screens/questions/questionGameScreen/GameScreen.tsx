import React, { useEffect } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "../../../app/DrawerNavigator";
import { useAppTheme } from "../../../theme";
import { AppBar } from "../../../components/AppBar";
import { Ionicons } from "@expo/vector-icons";
import { QuestionView } from "../../chatbot/components/chatBubble/QuestionView";
import { AnimatedProgressBar } from "../../../components/AnimatedProgressBar";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ScrollView } from "react-native-gesture-handler";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import { RootState } from "../../../app/store";
import { setIndex, initGame, setSelectedAnswer, updateBookmark } from "../../../features/game/gameSlice";
import { CustomText } from "../../../components/text/customText";
import { insertQuestions, deleteQuestion } from "../../../storage/database/tables";

type QuestionGameScreenRouteProp = RouteProp<RootStackParamList, "QuestionGameScreen">;
type QuestionGameScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "QuestionGameScreen">;

export const QuestionGameScreen = () => {
  const route = useRoute<QuestionGameScreenRouteProp>();
  const { questions } = route.params;

  const { colors } = useAppTheme();

  const questionList = useAppSelector((state: RootState) => state.game.questions);

  const currentQuestionIndex = useAppSelector((state: RootState) => state.game.currentQuestionIndex);
  const mapAnswerIds = useAppSelector((state: RootState) => state.game.selectedAnswers);
  const bookmarkIds = useAppSelector((state: RootState) => state.game.bookmarkedQuestions);

  const question = questionList[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questionList.length) * 100;

  const navigation = useNavigation<QuestionGameScreenNavigationProp>();

  const dispatch = useAppDispatch();

  const handleAnswerSelect = (answerId: number) => {
    dispatch(setSelectedAnswer(answerId));
  };

  useEffect(() => {
    dispatch(initGame(questions));
  }, []);

  const handleBookmarkPress = (isBookmarked: boolean) => {
    dispatch(updateBookmark({ questionId: question.questionId, isBookmarked }));

    // Update database
    if (isBookmarked) {
      insertQuestions([question]);
    } else {
      deleteQuestion(question.questionId);
    }
  };

  const handleChangeQuestion = (direction: "next" | "prev") => {
    // Check submit
    if (direction == "next" && currentQuestionIndex === questionList.length - 1) {
      navigation.replace("ResultScreen", {
        questions,
        mapAnswerIds,
      });
      return;
    }

    // Change question
    if (direction === "next") {
      dispatch(setIndex(currentQuestionIndex + 1));
    } else {
      dispatch(setIndex(currentQuestionIndex - 1));
    }
  };

  if (!question)
    return (
      <View style={[style.container, { backgroundColor: colors.background }]}>
        <CustomText>Lỗi khi tải câu hỏi. Vui lòng thử lại sau</CustomText>
      </View>
    );

  return (
    <View style={[style.container, { backgroundColor: colors.background }]}>
      <AppBar
        title={"Câu hỏi"}
        leftIcon={<Ionicons name="arrow-back" size={24} color="white" />}
        onLeftPress={() => navigation.pop()}
      />
      <View style={style.progressBar}>
        <AnimatedProgressBar progress={progress} />
      </View>
      <ScrollView style={style.questionContainer}>
        <QuestionView
          questionIndex={currentQuestionIndex}
          question={question}
          totalQuestions={questionList.length}
          selectedAnswer={mapAnswerIds[question.questionId]}
          bookmarked={bookmarkIds.includes(question.questionId)}
          onAnswerSelect={handleAnswerSelect}
          onBookmarkPress={handleBookmarkPress}
        />
      </ScrollView>
      <View style={style.buttonContainer}>
        <TouchableOpacity
          style={[style.navButton, style.prevButton, currentQuestionIndex === 0 && style.disabledButton]}
          onPress={() => handleChangeQuestion("prev")}
          disabled={currentQuestionIndex === 0}
        >
          <CustomText
            style={[style.navButtonText, style.navButtonTextPrev, currentQuestionIndex === 0 && style.disabledButtonText]}
          >
            Previous
          </CustomText>
        </TouchableOpacity>

        <TouchableOpacity style={[style.navButton, style.nextButton]} onPress={() => handleChangeQuestion("next")}>
          <CustomText style={[style.navButtonText, style.navButtonTextNext]}>Next</CustomText>
        </TouchableOpacity>
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
    marginBottom: 32,
  },
  navButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  prevButton: {
    backgroundColor: "#F8F9FA",
    borderWidth: 1,
    borderColor: "#E8E8E8",
    marginRight: 8,
  },
  nextButton: {
    backgroundColor: "#4A90E2",
    marginLeft: 8,
  },
  disabledButton: {
    backgroundColor: "#F5F5F5",
    borderColor: "#E0E0E0",
  },
  navButtonText: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  navButtonTextPrev: {
    color: "black",
  },
  navButtonTextNext: {
    color: "white",
  },
  disabledButtonText: {
    color: "#BDBDBD",
  },
});
