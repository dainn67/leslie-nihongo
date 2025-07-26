import React, { useState, useRef } from "react";
import { View, TouchableOpacity, StyleSheet, Animated } from "react-native";
import { CustomText } from "../../../../components/text/customText";
import { Question } from "../../../../models/question";
import { QuestionView } from "./QuestionView";
import { AnimatedProgressBar } from "../../../../components/AnimatedProgressBar";

interface QuestionsMessageProps {
  questionJson: string;
}

export const QuestionsMessage = ({ questionJson }: QuestionsMessageProps) => {
  const data = questionJson.replaceAll("```json", "").replaceAll("```", "");
  const questions: Question[] = JSON.parse(data);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>(Array(questions.length).fill(null));
  const [showExplanations, setShowExplanations] = useState<boolean[]>(Array(questions.length).fill(false));

  // Opacity animation for question transitions - use useRef to prevent recreation on re-render
  const fadeAnim = useRef(new Animated.Value(1)).current;

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

  const handleChangeQuestion = (direction: "next" | "prev") => {
    // Check if the question can be changed in the specified direction
    if ((direction === "next" && currentQuestionIndex < questions.length - 1) || (direction === "prev" && currentQuestionIndex > 0)) {
      // First fade out
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }).start(() => {
        // Update the question index after fade out completes
        const newIndex = direction === "next" ? currentQuestionIndex + 1 : currentQuestionIndex - 1;
        setCurrentQuestionIndex(newIndex);

        // Then fade in with the new content
        setTimeout(() => {
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 100,
            useNativeDriver: true,
          }).start();
        }, 50);
      });
    }
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
        selectedAnswer={selectedAnswers[currentQuestionIndex]}
        showExplanation={showExplanations[currentQuestionIndex]}
        onAnswerSelect={handleAnswerSelect}
        fadeAnim={fadeAnim}
      />

      {/* Navigation */}
      <View style={styles.navigationContainer}>
        <TouchableOpacity
          style={[styles.navButton, styles.prevButton, currentQuestionIndex === 0 && styles.disabledButton]}
          onPress={() => handleChangeQuestion("prev")}
          disabled={currentQuestionIndex === 0}
        >
          <CustomText style={[styles.navButtonText, styles.navButtonTextPrev, currentQuestionIndex === 0 && styles.disabledButtonText]}>
            Previous
          </CustomText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navButton, styles.nextButton, currentQuestionIndex === questions.length - 1 && styles.disabledButton]}
          onPress={() => handleChangeQuestion("next")}
          disabled={currentQuestionIndex === questions.length - 1}
        >
          <CustomText
            style={[styles.navButtonText, styles.navButtonTextNext, currentQuestionIndex === questions.length - 1 && styles.disabledButtonText]}
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
