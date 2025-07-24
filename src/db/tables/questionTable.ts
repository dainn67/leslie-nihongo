import { Question } from "../../models/question";
import { db } from "../database";

export const QuestionTable = {
  tableName: "Question",
  columnId: "id",
  columnQuestion: "question",
  columnExplanation: "explanation",
};

export const AnswerTable = {
  tableName: "Answer",
  columnId: "id",
  columnQuestionId: "questionId",
  columnAnswer: "answer",
  columnIsCorrect: "isCorrect",
};

export const createQuestionTable = () => {
  db.withTransactionSync(() => {
    db.execSync(
      `CREATE TABLE IF NOT EXISTS ${QuestionTable.tableName} (
          ${QuestionTable.columnId} TEXT PRIMARY KEY,
          ${QuestionTable.columnQuestion} TEXT,
          ${QuestionTable.columnExplanation} TEXT
        )`
    );

    db.execSync(
      `CREATE TABLE IF NOT EXISTS ${AnswerTable.tableName} (
          ${AnswerTable.columnId} INTEGER PRIMARY KEY AUTOINCREMENT,
          ${AnswerTable.columnQuestionId} TEXT,
          ${AnswerTable.columnAnswer} TEXT,
          ${AnswerTable.columnIsCorrect} INTEGER,
          FOREIGN KEY (${AnswerTable.columnQuestionId}) REFERENCES ${QuestionTable.tableName}(${QuestionTable.columnId})
        )`
    );
  });
};

export const insertQuestions = (questions: Question[]) => {
  db.withTransactionSync(() => {
    const questionValues = questions
      .map((question) => `('${question.id}', '${question.question}', '${question.explanation}')`)
      .join(", ");
    db.execSync(
      `INSERT INTO ${QuestionTable.tableName} (${QuestionTable.columnId}, ${QuestionTable.columnQuestion}, ${QuestionTable.columnExplanation}) VALUES ${questionValues}`
    );

    const answerValues = questions
      .flatMap((question) =>
        question.answers.map(
          (answer) => `('${question.id}', '${answer.text}', '${answer.isCorrect ? 1 : 0}')`
        )
      )
      .join(", ");
    db.execSync(
      `INSERT INTO ${AnswerTable.tableName} (${AnswerTable.columnQuestionId}, ${AnswerTable.columnAnswer}, ${AnswerTable.columnIsCorrect}) VALUES ${answerValues}`
    );
  });
};

export const getAllQuestions = () => {
  const questionRows = db.getAllSync(`SELECT * FROM ${QuestionTable.tableName}`);

  const questions: Question[] = questionRows.map((row: any) => ({
    id: row.id,
    question: row.question,
    explanation: row.explanation,
    answers: [],
  }));

  const answerRows = db.getAllSync(`SELECT * FROM ${AnswerTable.tableName}`);

  answerRows.forEach((row: any) => {
    const question = questions.find((question) => question.id === row.questionId);
    if (question) {
      question.answers.push({
        text: row.answer,
        isCorrect: row.isCorrect,
      });
    }
  });

  return questions;
};
