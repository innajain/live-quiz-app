import React from "react";
import { SocketManager } from "../api requests/SocketManager";

export function answerRevealListener({
  setCorrectAnswer,
}: {
  setCorrectAnswer: React.Dispatch<React.SetStateAction<{problemIdx: number, answer: number} | undefined>>;
}) {
  SocketManager.getSocket()?.on("answerReveal", ({ problemIdx, answer }) => {
    setCorrectAnswer({problemIdx, answer});
  });
}
