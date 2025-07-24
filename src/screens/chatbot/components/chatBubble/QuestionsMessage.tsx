import React, { useState } from "react";
import { View, TouchableOpacity, StyleSheet, Button } from "react-native";
import { CustomText } from "../../../../components/text/customText";
import { Question } from "../../../../models/question";

interface QuestionsMessageProps {
  questionJson: string;
}

export const QuestionsMessage = ({ questionJson }: QuestionsMessageProps) => {
  const data = questionJson.replaceAll("```json", "").replaceAll("```", "");
  const questions: Question[] = JSON.parse(data);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>(
    Array(questions.length).fill(null)
  );
  const [showExplanations, setShowExplanations] = useState<boolean[]>(
    Array(questions.length).fill(false)
  );

  const handleAnswerSelect = (index: number) => {
    if (selectedAnswers[currentQuestionIndex] === null) {
      const newSelectedAnswers = [...selectedAnswers];
      newSelectedAnswers[currentQuestionIndex] = index;
      setSelectedAnswers(newSelectedAnswers);

      const newShowExplanations = [...showExplanations];
      newShowExplanations[currentQuestionIndex] = true;
      setShowExplanations(newShowExplanations);
    }
  };

  const getAnswerLabel = (index: number) => {
    switch (index) {
      case 0:
        return "A";
      case 1:
        return "B";
      case 2:
        return "C";
      case 3:
        return "D";
      default:
        return "A";
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const question = questions[currentQuestionIndex];

  return (
    <View style={styles.questionContainer}>
      <CustomText style={styles.questionText}>
        Question: {question.question}
      </CustomText>
      {question.answer.map((a: any, index: number) => (
        <TouchableOpacity
          key={index}
          onPress={() => handleAnswerSelect(index)}
          style={[
            styles.answerContainer,
            selectedAnswers[currentQuestionIndex] === index &&
              a.isCorrect &&
              styles.correctAnswer,
            selectedAnswers[currentQuestionIndex] === index &&
              !a.isCorrect &&
              styles.wrongAnswer,
          ]}
          disabled={selectedAnswers[currentQuestionIndex] !== null}
        >
          <CustomText style={styles.answerText}>
            {getAnswerLabel(index)}: {a.text}
          </CustomText>
        </TouchableOpacity>
      ))}
      {showExplanations[currentQuestionIndex] && (
        <CustomText style={styles.explanationText}>
          Explanation: {question.explanation}
        </CustomText>
      )}
      <View style={styles.navigationButtons}>
        <Button
          title="Previous"
          onPress={handlePrevQuestion}
          disabled={currentQuestionIndex === 0}
        />
        <Button
          title="Next"
          onPress={handleNextQuestion}
          disabled={currentQuestionIndex === questions.length - 1}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  questionContainer: {
    padding: 16,
    backgroundColor: "#f0f8ff",
    borderRadius: 12,
    marginBottom: 8,
  },
  questionText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  answerContainer: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#dcdcdc",
    borderRadius: 8,
    marginBottom: 8,
  },
  selectedAnswer: {
    borderColor: "green",
    backgroundColor: "#e6f7ff",
  },
  correctAnswer: {
    borderColor: "green",
    backgroundColor: "#e6f7ff",
  },
  wrongAnswer: {
    borderColor: "red",
    backgroundColor: "#ffe6e6",
  },
  answerText: {
    fontSize: 16,
  },
  explanationText: {
    marginTop: 12,
    fontSize: 16,
    fontStyle: "italic",
    color: "#696969",
  },
  navigationButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
});
