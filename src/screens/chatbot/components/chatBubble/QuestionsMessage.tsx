import React, { useState } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { CustomText } from "../../../../components/text/customText";
import { Question } from "../../../../models/question";
import { QuestionView } from "./QuestionView";
import { AnimatedProgressBar } from "../../../../components/AnimatedProgressBar";
import { deleteQuestion, insertQuestions } from "../../../../storage/database/tables/questionTable";

interface QuestionsMessageProps {
  questions: Question[];
}

export const QuestionsMessage = ({ questions }: QuestionsMessageProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>(Array(questions.length).fill(null));
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState<boolean[]>(Array(questions.length).fill(false));
  const [showExplanations, setShowExplanations] = useState<boolean[]>(Array(questions.length).fill(false));

  const handleAnswerSelect = (index: number) => {
    if (selectedAnswers[currentQuestionIndex] === null) {
      // Update selected answer list
      const newSelectedAnswers = [...selectedAnswers];
      newSelectedAnswers[currentQuestionIndex] = index;
      setSelectedAnswers(newSelectedAnswers);

      // Update explanation list
      const newShowExplanations = [...showExplanations];
      newShowExplanations[currentQuestionIndex] = true;
      setShowExplanations(newShowExplanations);
    }
  };

  const handleBookmarkPress = (isBookmarked: boolean) => {
    const newBookmarkedQuestions = [...bookmarkedQuestions];
    newBookmarkedQuestions[currentQuestionIndex] = isBookmarked;
    setBookmarkedQuestions(newBookmarkedQuestions);

    // Update database
    if (isBookmarked) {
      insertQuestions([questions[currentQuestionIndex]]);
    } else {
      deleteQuestion(questions[currentQuestionIndex].questionId);
    }
  };

  const handleChangeQuestion = (direction: "next" | "prev") => {
    const newIndex = direction === "next" ? currentQuestionIndex + 1 : currentQuestionIndex - 1;
    setCurrentQuestionIndex(newIndex);
  };

  const question = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <View style={styles.container}>
      {/* Progress Bar */}
      <AnimatedProgressBar progress={progress} />

      <QuestionView
        question={question}
        questionIndex={currentQuestionIndex}
        totalQuestions={questions.length}
        bookmarked={bookmarkedQuestions[currentQuestionIndex]}
        selectedAnswer={selectedAnswers[currentQuestionIndex]}
        onAnswerSelect={handleAnswerSelect}
        onBookmarkPress={handleBookmarkPress}
      />

      {/* Navigation */}
      <View style={styles.navigationContainer}>
        <TouchableOpacity
          style={[styles.navButton, styles.prevButton, currentQuestionIndex === 0 && styles.disabledButton]}
          onPress={() => handleChangeQuestion("prev")}
          disabled={currentQuestionIndex === 0}
        >
          <CustomText
            style={[
              styles.navButtonText,
              styles.navButtonTextPrev,
              currentQuestionIndex === 0 && styles.disabledButtonText,
            ]}
          >
            Previous
          </CustomText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.navButton,
            styles.nextButton,
            currentQuestionIndex === questions.length - 1 && styles.disabledButton,
          ]}
          onPress={() => handleChangeQuestion("next")}
          disabled={currentQuestionIndex === questions.length - 1}
        >
          <CustomText
            style={[
              styles.navButtonText,
              styles.navButtonTextNext,
              currentQuestionIndex === questions.length - 1 && styles.disabledButtonText,
            ]}
          >
            Next
          </CustomText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    flex: 1,
  },

  progressTextContainer: {
    minWidth: 50,
  },
  navigationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
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
  },
  nextButton: {
    backgroundColor: "#4A90E2",
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
