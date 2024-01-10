import React, { useEffect } from "react";

import { useLocation, useParams } from "react-router-dom";
import { joinQuizReplyListener } from "../socket listeners/joinQuizReplyListener";
import { startQuizListener } from "../socket listeners/startQuizListener";
import { answerRevealListener } from "../socket listeners/recieveAnswerListener";
import { nextProblemListener } from "../socket listeners/nextProblemListener";
import { Background } from "../components";
import { SocketManager } from "../api requests/SocketManager";
import { ProblemScreen } from "./Temp";
import { endQuizListener } from "../socket listeners/endQuizListener";

export type Problem = {
  question: string;
  options: string[];
};

function Quiz() {
  const { quizId } = useParams<{ quizId: string }>();
  const [quizState, setQuizState] = React.useState<
    "notStarted" | "problem" | "finished" | "leaderboard"
  >("notStarted");
  const [problem, setProblem] = React.useState<Problem>();
  const [currentProblemIndex, setCurrentProblemIndex] =
    React.useState<number>(-1);
  const [totalProblemsCount, setTotalProblemsCount] = React.useState<number>();
  const [correctAnswer, setCorrectAnswer] = React.useState<{
    problemIdx: number;
    answer: number;
  }>();
  const [selectedOption, setSelectedOption] = React.useState<number>();
  const location = useLocation();

  useEffect(() => {
    if (!location.state) {
      return;
    }
    SocketManager.connect();
    SocketManager.joinQuiz({
      quizId: (quizId!),
      userId: location.state.userId,
    });
    joinQuizReplyListener({
      setProblem,
      setTotalProblems: setTotalProblemsCount,
      setQuizState,
      setCurrentProblemIndex,
    });
    startQuizListener({
      setProblem,
      setCurrentProblemIndex,
      setQuizState,
    });
    answerRevealListener({
      setCorrectAnswer,
    });
    nextProblemListener({
      setCurrentProblemIndex,
      setProblem,
      setCorrectAnswer,
      setQuizState,
      setSelectedOption,
    });
    endQuizListener(
      {setQuizState}
    )
  }, []);

  if (!location.state)
    return (
      <Background>
        <div className="text-white">Please try to join the quiz first</div>
      </Background>
    );
    if (quizState === "finished") {
      return (
        <Background>
          <div className="h-[100vh] flex items-center text-5xl font-bold">
            Quiz ended
          </div>
        </Background>
      );
    }
    
    if (quizState === "problem" && totalProblemsCount!==undefined) {
      return <ProblemScreen problem={
        {
          currentProblemIndex,
          totalProblemsCount,
          question: problem!.question,
          options: problem!.options,
          correctAnswer: correctAnswer?.answer,
          selectedOption,
          setSelectedOption,
          timeAlloted: 5,
        }
      }/>
    }
  return (
    <Background>
      <div className="h-[100vh] flex items-center text-5xl font-bold">
        Waiting for quiz to start...
      </div>
    </Background>
  );
}

export default Quiz;
