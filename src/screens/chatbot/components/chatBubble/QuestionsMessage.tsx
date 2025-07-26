import React, { useState } from "react";
import { View, TouchableOpacity, StyleSheet, Animated } from "react-native";
import { CustomText } from "../../../../components/text/customText";
import { Question } from "../../../../models/question";

interface QuestionsMessageProps {
  questionJson: string;
}

export const QuestionsMessage = ({ questionJson }: QuestionsMessageProps) => {
  const data = questionJson.replaceAll("```json", "").replaceAll("```", "");
  const questions: Question[] = JSON.parse(data);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>(Array(questions.length).fill(null));
  const [showExplanations, setShowExplanations] = useState<boolean[]>(Array(questions.length).fill(false));

  // Opacity animation for question transitions
  const fadeAnim = new Animated.Value(1);

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

  const getAnswerLabel = (index: number) => {
    const labels = ["A", "B", "C", "D"];
    return (labels[index] || "A") + ".";
  };

  // Function to handle changing the current question
  const handleChangeQuestion = (direction: "next" | "prev") => {
    const duration = 200;
    // Check if the question can be changed in the specified direction
    if ((direction === "next" && currentQuestionIndex < questions.length - 1) || (direction === "prev" && currentQuestionIndex > 0)) {
      // Perform a fade-out and fade-in animation when changing questions
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: duration / 2,
          useNativeDriver: false,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: duration,
          useNativeDriver: false,
        }),
      ]).start();
      // Update the current question index after the fade-out animation
      setTimeout(() => {
        setCurrentQuestionIndex(direction === "next" ? currentQuestionIndex + 1 : currentQuestionIndex - 1);
      }, duration / 2);
    }
  };

  // Get the current question and calculate the progress percentage
  const question = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <View style={styles.container}>
      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressTextContainer}>
          <CustomText style={styles.progressText}>
            {currentQuestionIndex + 1} / {questions.length}
          </CustomText>
        </View>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
      </View>

      <Animated.View style={[styles.questionCard, { opacity: fadeAnim }]}>
        {/* Question Header */}
        <View style={styles.questionHeader}>
          <View style={styles.questionIndex}>
            <CustomText style={styles.questionNumberText}>Câu hỏi {currentQuestionIndex + 1}:</CustomText>
          </View>
          <CustomText style={styles.questionText}>{question.question}</CustomText>
        </View>

        {/* Answers */}
        <View style={styles.answersContainer}>
          {question.answers.map((a: any, index: number) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleAnswerSelect(index)}
              style={[
                styles.answerCard,
                selectedAnswers[currentQuestionIndex] === index && a.isCorrect && styles.correctAnswer,
                selectedAnswers[currentQuestionIndex] === index && !a.isCorrect && styles.wrongAnswer,
                selectedAnswers[currentQuestionIndex] !== null &&
                  selectedAnswers[currentQuestionIndex] !== index &&
                  a.isCorrect &&
                  styles.correctAnswer,
              ]}
              disabled={selectedAnswers[currentQuestionIndex] !== null}
            >
              <View style={styles.answerContent}>
                <CustomText
                  style={[
                    styles.answerLabelText,
                    selectedAnswers[currentQuestionIndex] === index && !a.isCorrect && styles.wrongLabel,
                    selectedAnswers[currentQuestionIndex] !== null &&
                      selectedAnswers[currentQuestionIndex] !== index &&
                      a.isCorrect &&
                      styles.correctLabel,
                  ]}
                >
                  {getAnswerLabel(index)}
                </CustomText>
                <CustomText style={[styles.answerText, selectedAnswers[currentQuestionIndex] === index && styles.selectedAnswerText]}>
                  {a.text}
                </CustomText>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Explanation */}
        {showExplanations[currentQuestionIndex] && (
          <View style={styles.explanationContainer}>
            <View style={styles.explanationHeader}>
              <CustomText style={styles.explanationIcon}>💡</CustomText>
              <CustomText style={styles.explanationTitle}>Explanation</CustomText>
            </View>
            <CustomText style={styles.explanationText}>{question.explanation}</CustomText>
          </View>
        )}

        {/* Navigation */}
        <View style={styles.navigationContainer}>
          <TouchableOpacity
            style={[styles.navButton, styles.prevButton, currentQuestionIndex === 0 && styles.disabledButton]}
            onPress={() => handleChangeQuestion("prev")}
            disabled={currentQuestionIndex === 0}
          >
            <CustomText style={[styles.navButtonText, currentQuestionIndex === 0 && styles.disabledButtonText]}>← Previous</CustomText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.navButton, styles.nextButton, currentQuestionIndex === questions.length - 1 && styles.disabledButton]}
            onPress={() => handleChangeQuestion("next")}
            disabled={currentQuestionIndex === questions.length - 1}
          >
            <CustomText style={[styles.navButtonText, currentQuestionIndex === questions.length - 1 && styles.disabledButtonText]}>Next →</CustomText>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    flex: 1,
  },
  progressContainer: {
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: "#E8E8E8",
    borderRadius: 3,
    overflow: "hidden",
    marginRight: 8,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#4A90E2",
    borderRadius: 3,
  },
  progressTextContainer: {
    minWidth: 50,
  },
  progressText: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
    fontWeight: "500",
    marginHorizontal: 10,
  },
  questionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  questionHeader: {
    alignItems: "flex-start",
    marginBottom: 20,
  },
  questionIndex: {
    marginBottom: 2,
  },
  questionNumberText: {
    fontSize: 14,
    color: "gray",
    fontWeight: "bold",
  },
  questionText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2C3E50",
    flex: 1,
    lineHeight: 24,
  },
  answersContainer: {
    marginBottom: 4,
  },
  answerCard: {
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: "transparent",
    overflow: "hidden",
  },
  answerContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
  },
  answerLabelText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#666",
    marginLeft: 8,
    marginRight: 12,
    marginVertical: 4,
  },
  correctLabel: {
    color: "#4CAF50",
  },
  wrongLabel: {
    color: "#F44336",
  },
  answerText: {
    fontSize: 16,
    color: "#2C3E50",
    flex: 1,
    lineHeight: 22,
  },
  selectedAnswerText: {
    fontWeight: "600",
  },
  correctAnswer: {
    backgroundColor: "#E8F5E8",
    borderColor: "#4CAF50",
  },
  wrongAnswer: {
    backgroundColor: "#FFEBEE",
    borderColor: "#F44336",
  },
  explanationContainer: {
    backgroundColor: "#F0F8FF",
    borderRadius: 4,
    padding: 12,
    paddingVertical: 8,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#4A90E2",
  },
  explanationHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  explanationIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  explanationTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2C3E50",
  },
  explanationText: {
    fontSize: 14,
    color: "#34495E",
    lineHeight: 20,
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
  disabledButtonText: {
    color: "#BDBDBD",
  },
});
