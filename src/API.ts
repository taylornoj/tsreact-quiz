import { shuffleArray } from "./utils";

export type Question = {
  category: string;
  correct_answer: string;
  difficulty: string;
  incorrect_answers: string[];
  question: string;
  type: string;
}

// want correct and incorrect answers to be in one string
export type QuestionState = Question & { answers: string[] };

// function that will grab data from API
export const fetchQuizQuestions = async (
  amount: number,
  difficulty: string,
  category: number
) => {
  const endpoint = `https://opentdb.com/api.php?amount=${amount}&difficulty=${difficulty}&type=multiple&category=${category}`
  const data = await (await fetch(endpoint)).json()

  return data.results.map((question: Question) => ({
      ...question,
      answers: shuffleArray([
          ...question.incorrect_answers,
          question.correct_answer,
      ]),
  }))
}