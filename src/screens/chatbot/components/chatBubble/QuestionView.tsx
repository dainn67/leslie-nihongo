import React from "react";
import { View, TouchableOpacity, StyleSheet, Animated } from "react-native";
import { CustomText } from "../../../../components/text/customText";
import { Question } from "../../../../models/question";

interface QuestionViewProps {
  question: Question;
  questionIndex: number;
  totalQuestions: number;
  selectedAnswer: number | null;
  showExplanation: boolean;
  onAnswerSelect: (index: number) => void;
  fadeAnim: Animated.Value;
}

export const QuestionView = ({
  question,
  questionIndex,
  totalQuestions,
  selectedAnswer,
  showExplanation,
  onAnswerSelect,
  fadeAnim,
}: QuestionViewProps) => {
  const getAnswerLabel = (index: number) => {
    const labels = ["A", "B", "C", "D"];
    return (labels[index] || "A") + ".";
  };

  return (
    <Animated.View style={[styles.questionCard, { opacity: fadeAnim }]}>
      {/* Question Header */}
      <View style={styles.questionHeader}>
        <View style={styles.questionIndex}>
          <CustomText style={styles.questionNumberText}>
            Câu hỏi {questionIndex + 1}/{totalQuestions}:
          </CustomText>
        </View>
        <CustomText style={styles.questionText}>{question.question}</CustomText>
      </View>

      {/* Answers */}
      <View style={styles.answersContainer}>
        {question.answers.map((a: any, index: number) => (
          <TouchableOpacity
            key={index}
            onPress={() => onAnswerSelect(index)}
            style={[
              styles.answerCard,
              selectedAnswer === index && a.isCorrect && styles.correctAnswer,
              selectedAnswer === index && !a.isCorrect && styles.wrongAnswer,
              selectedAnswer !== null && selectedAnswer !== index && a.isCorrect && styles.correctAnswer,
            ]}
            disabled={selectedAnswer !== null}
          >
            <View style={styles.answerContent}>
              <CustomText
                style={[
                  styles.answerLabelText,
                  selectedAnswer === index && !a.isCorrect && styles.wrongLabel,
                  selectedAnswer !== null && selectedAnswer !== index && a.isCorrect && styles.correctLabel,
                ]}
              >
                {getAnswerLabel(index)}
              </CustomText>
              <CustomText style={[styles.answerText, selectedAnswer === index && styles.selectedAnswerText]}>{a.text}</CustomText>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Explanation */}
      {showExplanation && (
        <View style={styles.explanationContainer}>
          <View style={styles.explanationHeader}>
            <CustomText style={styles.explanationIcon}>💡</CustomText>
            <CustomText style={styles.explanationTitle}>Explanation</CustomText>
          </View>
          <CustomText style={styles.explanationText}>{question.explanation}</CustomText>
        </View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
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
});
