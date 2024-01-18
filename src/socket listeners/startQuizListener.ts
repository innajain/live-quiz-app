import React from "react";
import { SocketManager } from "../api requests/SocketManager";
import { Problem } from "../routes/Quiz";

export function startQuizListener({
    setProblem,
    setCurrentProblemIndex,
    setQuizState
}:{
    setProblem: React.Dispatch<React.SetStateAction<Problem | undefined>>;
    setCurrentProblemIndex: React.Dispatch<React.SetStateAction<number >>;
    setQuizState: React.Dispatch<React.SetStateAction< "notStarted" | "problem" | "finished" | "leaderboard">>;
}) {
  SocketManager.getSocket()?.on(
    "startQuiz",
    ({problem}) => {
        setProblem({
            question: problem.question,
            options: problem.options,
        });
        setCurrentProblemIndex(0);
        setQuizState("problem");
    }
  );
}
