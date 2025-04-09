import { useEffect, useReducer } from "react";
import Header from "./Header.jsx";
import "./App.css";
import MainSection from "./mainSection.jsx";
import Loader from "./Loader.jsx";
import Error from "./Error.jsx";
import StartScreen from "./StartScreen.jsx";
import Question from "./Question.jsx";
import NextButton from "./NextButton.jsx";
import Progress from "./progress.jsx";
import FinishScreen from "./FinishScreen.jsx";
import Footer from "./Footer.jsx";
import Timer from "./Timer.jsx";

const initialState = {
  questions: [],
  status: "loading",
  index: 0,
  answer: null,
  points: 0,
  highscore: 0,
  secondsRemaining: null,
};
const secsPerQuestion = 20;
function reducer(state, action) {
  switch (action.type) {
    case "dataRecieved":
      return {
        ...state,
        questions: action.payload,
        status: "ready",
      };
    case "dataFailed":
      return {
        ...state,
        status: "error",
      };
    case "start":
      return {
        ...state,
        status: "active",
        secondsRemaining: state.questions.length * secsPerQuestion,
      };
    case "newAnswer": {
      const question = state.questions.at(state.index);
      return {
        ...state,
        answer: action.payload,
        points:
          action.payload === question.correctOption
            ? state.points + question.points
            : state.points,
      };
    }
    case "nextQuestion":
      return {
        ...state,
        index: state.index + 1,
        answer: null,
      };
    case "finishQuiz":
      return {
        ...state,
        status: "finished",
        highscore:
          state.points > state.highscore ? state.points : state.highscore,
      };
    case "restart":
      return {
        ...initialState,
        questions: state.questions,
        status: "ready",
      };
    case "tick":
      return {
        ...state,
        secondsRemaining: state.secondsRemaining - 1,
        status: state.secondsRemaining === 0 ? "finished" : state.status,
      };
    default:
      console.error(`Unknown action: ${action.type}`);
      return state;
  }
}

function App() {
  const [
    { questions, status, index, answer, points, highscore, secondsRemaining },
    dispatch,
  ] = useReducer(reducer, initialState);

  const numQuestions = questions.length;
  const maxPoints = questions.reduce((prev, cur) => prev + cur.points, 0);

  useEffect(function () {
    fetch("http://localhost:8000/questions")
      .then((res) => res.json())
      .then((data) => dispatch({ type: "dataRecieved", payload: data }))
      .catch(() => dispatch({ type: "dataFailed" }));
  }, []);

  return (
    <div className="app">
      <Header />
      <MainSection>
        {status === "loading" && <Loader />}
        {status === "error" && <Error />}
        {status === "ready" && (
          <StartScreen numQuestions={numQuestions} dispatch={dispatch} />
        )}
        {status === "active" && (
          <>
            <Progress
              index={index}
              numQuestions={numQuestions}
              maxPoints={maxPoints}
              points={points}
              answer={answer}
            />
            <Question
              question={questions[index]}
              dispatch={dispatch}
              answer={answer}
              points={points}
            />

            <Footer>
              <Timer dispatch={dispatch} secondsRemaining={secondsRemaining} />
              <NextButton
                dispatch={dispatch}
                answer={answer}
                index={index}
                numQuestion={numQuestions}
              />
            </Footer>
          </>
        )}
        {status === "finished" && (
          <>
            <FinishScreen
              points={points}
              MaxPoints={maxPoints}
              highscore={highscore}
              dispatch={dispatch}
            />
          </>
        )}
      </MainSection>
    </div>
  );
}

export default App;
