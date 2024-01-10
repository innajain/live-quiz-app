import { SocketManager } from "../api requests/SocketManager";
import { Problem } from "../routes/Quiz";

export function nextProblemListener({
  setProblem,
  setCurrentProblemIndex,
  setSelectedOption,
  setCorrectAnswer,
  setQuizState,
}: {
  setProblem: React.Dispatch<React.SetStateAction<Problem | undefined>>;
  setCurrentProblemIndex: React.Dispatch<React.SetStateAction<number>>;
  setSelectedOption: React.Dispatch<React.SetStateAction<number | undefined>>;
  setCorrectAnswer: React.Dispatch<
    React.SetStateAction<{ problemIdx: number; answer: number } | undefined>
  >;
  setQuizState: React.Dispatch<
    React.SetStateAction<"notStarted" | "problem" | "finished" | "leaderboard">
  >;
}) {
  SocketManager.getSocket()?.on("nextProblem", ({ problem }) => {
    setCurrentProblemIndex((v) => v! + 1);
    setProblem(problem);
    setSelectedOption(undefined);
    setCorrectAnswer(undefined);
    setQuizState("problem");
  });
}
