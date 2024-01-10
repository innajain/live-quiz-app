import React from "react";
import { SocketManager } from "../api requests/SocketManager";
import { Problem } from "../routes/Quiz";

export function endQuizListener({
  setQuizState
}:{
  setQuizState: React.Dispatch<React.SetStateAction<"notStarted" | "problem" | "finished" | "leaderboard">>;
}) {
  SocketManager.getSocket()?.on("endQuiz", () => {
    SocketManager.disconnect();
    setQuizState("finished");
  });
}
