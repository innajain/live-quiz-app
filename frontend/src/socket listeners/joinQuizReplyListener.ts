import React from "react";
import { SocketManager } from "../api requests/SocketManager";
import { Problem } from "../routes/Quiz";

export function joinQuizReplyListener({
  setProblem,
  setTotalProblems,
  setQuizState,
  setCurrentProblemIndex,
}: {
  setProblem: React.Dispatch<React.SetStateAction<Problem | undefined>>;
  setTotalProblems: React.Dispatch<React.SetStateAction<number | undefined>>;
  setQuizState: React.Dispatch<
    React.SetStateAction<"notStarted" | "problem" | "finished" | "leaderboard">
  >;
  setCurrentProblemIndex: React.Dispatch<React.SetStateAction<number>>;
}) {
  SocketManager.getSocket()?.on(
    "joinQuizReply",
    ({
      currentProblemIndex,
      totalProblems,
      currentProblem,
    }: {
      currentProblemIndex: number;
      totalProblems: number;
      currentProblem: {
        question: string;
        options: string[];
      };
    }) => {
      currentProblemIndex != -1 &&
        setProblem({
          question: currentProblem.question,
          options: currentProblem.options,
        });
      setTotalProblems(totalProblems);
      setCurrentProblemIndex(currentProblemIndex);
      if (currentProblemIndex === -1) {
        setQuizState("notStarted");
      } else {
        setQuizState("problem");
      }
      SocketManager.getSocket()!.off("joinQuizReply");
    }
  );
}
