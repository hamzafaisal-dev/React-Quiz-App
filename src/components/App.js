import { useEffect, useReducer } from "react";
import Header from "./Header"
import Main from "./Main";
import Loader from "./Loader"
import Error from "./Error"
import StartScreen from "./StartScreen";
import Question from "./Question";
import NextButton from "./NextButton";
import Progress from "./Progress";
import FinishScreen from "./FinishScreen";
import Timer from "./Timer";
import Footer from "./Footer"

const SECS_PER_QUESTION = 30;

const initialState = {
  questions: [],
  status: 'loading', // 'loading', 'error', 'ready', 'active', 'finished'
  index: 0,
  answer: null,
  points: 0,
  highScore: 0,
  secondsRemaining: null
};

function reducer(state, action) {
  switch (action.type) {
    case "dataReceived":
      return {
        ...state,
        questions: action.payload,
        status: "ready"
      }
    case "dataFailed":
      return {
        ...state, status: 'error'
      }
    case "start":
      return {
        ...state, status: 'active', secondsRemaining: state.questions.length * SECS_PER_QUESTION
      }
    case "newAnswer":

      const currentQuestion = state.questions.at(state.index);

      return {
        ...state,
        answer: action.payload,
        points: action.payload === currentQuestion.correctOption ? state.points + currentQuestion.points : state.points
      }
    case 'nextQuestion':
      return {
        ...state,
        index: state.index + 1,
        answer: null
      }
    case 'finish':
      return {
        ...state, status: 'finished', highScore: state.points > state.highScore ? state.points : state.highScore, answer: null
      }
    case 'reset':
      return {
        ...initialState, questions: state.questions, status: 'ready'
      }
    case 'tick':
      return {
        ...state, secondsRemaining: state.secondsRemaining - 1, status: state.secondsRemaining === 0 ? 'finished' : state.status
      }
    default:
      throw new Error("Action unknown");
  }
};

export default function App() {

  const [state, dispatch] = useReducer(reducer, initialState);

  const { questions, status, index, answer, points, highScore, secondsRemaining } = state;

  const numQuestions = questions.length;
  const maxPoints = questions.reduce((prev, curr) => prev + curr.points, 0)

  useEffect(function () {
    fetch("http://localhost:8000/questions")
      .then(res => res.json())
      .then(data => dispatch({ type: 'dataReceived', payload: data }))
      .catch(err => dispatch({ type: 'dataFailed', payload: err }))
  }, []);

  return (
    <div className="app">
      <Header />
      <Main className="main">
        <>
          {status === 'loading' && <Loader />}
          {status === 'error' && <Error />}
          {status === 'ready' && <StartScreen numQuestions={numQuestions} dispatch={dispatch} />}
          {status === 'active' && (
            <>
              <Progress index={index} numQuestions={numQuestions} points={points} maxPoints={maxPoints} answer={answer} />
              <Question question={questions[index]} dispatch={dispatch} answer={answer} />
              <Footer>
                <Timer dispatch={dispatch} secondsRemaining={secondsRemaining} />
                <NextButton dispatch={dispatch} answer={answer} index={index} numQuestions={numQuestions} />
              </Footer>
            </>
          )}
          {status === 'finished' && <FinishScreen points={points} maxPoints={maxPoints} highScore={highScore} dispatch={dispatch} answer={answer} />}
        </>
      </Main>
    </div>
  );
}