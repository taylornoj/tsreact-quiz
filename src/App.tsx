import React from 'react';
import { useState } from 'react';
import QuestionCard from './components/QuestionCard';
import { fetchQuizQuestions } from './API';
import { QuestionState } from './API';
import { GlobalStyle, Wrapper } from './App.styles';

import QuizSettings from './components/QuizSettings';

// if we want to show all questions at the end, we now have them in this array
export type AnswerObject = {
  question: string;
  answer: string;
  // correct: tell if the user answered correctly
  correct: boolean;
  // will have correct answer
  correctAnswer: string;
}

const App = () => {
  const [loading, setLoading] = useState(false);
  // telling ts this will be array of QuestionState
  const [questions, setQuestions] = useState<QuestionState[]>([]);
  const [number, setNumber] = useState(0);
  const [userAnswers, setUserAnswers] = useState<AnswerObject[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(true);

  const [category, setCategory] = useState(0)
  const [difficulty, setDifficulty] = useState('easy')
  const [numQuestions, setNumQuestions] = useState(3)

  // func to fire when we start quiz; will make API call
  const startTrivia = async () => {
    // when we click start button, we are loading the API
    setLoading(true);
    // when we start a new game it's not game over
    setGameOver(false);

    // hit endpoint
    const newQuestions = await fetchQuizQuestions(
      numQuestions,
      difficulty,
      category
    )
    // when await is done and we have all questions, we then...
    // can use try & catch block here as stretch
    setQuestions(newQuestions);
    setScore(0);
    setUserAnswers([]);
    setNumber(0);
    // we stop loading
    setLoading(false);
  };

  // trigger when user selects an answer
  const checkAnswer = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!gameOver) {
      const answer = e.currentTarget.value
      const correct = questions[number].correct_answer === answer
      const answerObject = {
        question: questions[number].question,
        answer,
        correct,
        correctAnswer: questions[number].correct_answer,
      }
      if (correct) {
        setScore((prev) => prev + 1)
        setUserAnswers((prev) => [...prev, answerObject])
      } else {
        setUserAnswers((prev) => [...prev, answerObject])
      }
    }
    if (number === numQuestions - 1) {
      setGameOver(true)
    }
    console.log('GAME OVER: ', gameOver)
  }

  // trigger when user clicks for next question
  const nextQuestion = () => {
    if (number + 1 === numQuestions) {
      setGameOver(true)
    } else {
      setNumber(number + 1)
    }
  }

  return (
    <>
      <GlobalStyle />
      <Wrapper>
        <h1>Trivia Night</h1>


        {!gameOver ||
          (userAnswers.length === questions.length &&
            userAnswers.length > 0) ? (
          <p className="score">
            Score: {score}/{numQuestions}{' '}
          </p>
        ) : null}
        {gameOver && userAnswers.length !== 0 ? (
          <h2>Game Over</h2>
        ) : null}
        {gameOver ? (
          <>
            <QuizSettings
              setNumQuestions={setNumQuestions}
              setCategory={setCategory}
              setDifficulty={setDifficulty}
            />
            <button className="start" onClick={startTrivia}>
              Start Quiz
            </button>

          </>
        ) : null}
        {loading && <p>Loading Questions ...</p>}
        {!loading && questions.length !== 0 && (
          <QuestionCard
            questionNum={number + 1}
            totalQuestions={numQuestions}
            question={questions[number].question}
            answers={questions[number].answers}
            userAnswer={
              userAnswers ? userAnswers[number] : undefined
            }
            callback={checkAnswer}
          />
        )}
        {!gameOver && !loading && userAnswers.length === number + 1 ? (
          <button className="next" onClick={nextQuestion}>
            Next Question
          </button>
        ) : null}
      </Wrapper>
    </>
  )
}


export default App;