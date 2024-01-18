import React, { useEffect } from "react";
import { SocketManager } from "../api requests/SocketManager";
import { useLocation, useParams } from "react-router-dom";
import { Background, Button } from "../components";

function QuizManager() {
  const { quizId } = useParams<{ quizId: string }>();
  const [message, setMessage] = React.useState("");
  const [errorOccurred, setErrorOccurred] = React.useState(true);
  const [quiz, setQuiz] = React.useState<any>({});
  const [quizState, setQuizState] = React.useState<
    "not started" | "problem" | "finished" | "leaderboard"
  >("not started");
  const [currentProblemIndex, setCurrentProblemIndex] =
    React.useState<number>(-1);
  useEffect(() => {
    SocketManager.connect();
    SocketManager.getSocket()!.emit("joinQM", {
      emailId: "abc",
      password: "123",
      quizId: quizId,
    });
    SocketManager.getSocket()!.on("joinQMReply", (data) => {
      if (!data.success) {
        setMessage(data.message);
        return;
      }
      setQuiz(data.quiz);
      setErrorOccurred(false);
      SocketManager.getSocket()!.off("joinQMReply");
    });
  }, []);
  if (errorOccurred) {
    return (
      <Background>
        <div className="flex flex-col items-center justify-center text-white">
          {message}
        </div>
      </Background>
    );
  }
  if (quizState === "finished") {
    return (
      <Background>
        <div className="h-[100vh] flex items-center text-5xl font-bold">
          Quiz Ended
        </div>
      </Background>
    );
  }
  return (
    <Background>
      <div className="flex flex-col items-center justify-center text-white mt-52">
        
        {quizState == "not started" && (
          <div className="mb-3">
            <Button
              onClick={() => {
                SocketManager.getSocket()!.emit("startQuiz");
                setCurrentProblemIndex((v) => v + 1);
                setQuizState("problem");
              }}
            >
              Start Quiz
            </Button>
          </div>
        )}
        {quizState == "problem" && (
          <div>{quiz!.problems![currentProblemIndex].question}</div>
        )}
        <div className="flex gap-2">
          <Button
            onClick={() => SocketManager.getSocket()!.emit("answerReveal")}
          >
            Reveal Answer
          </Button>
          <Button
            onClick={() => {
              SocketManager.getSocket()!.emit("nextProblem");
              setCurrentProblemIndex((v) => v + 1);
            }}
          >
            Next Problem
          </Button>
          <Button
            onClick={() => SocketManager.getSocket()!.emit("showLeaderboard")}
          >
            Show Leaderboard
          </Button>

          <Button
            onClick={() => {
              SocketManager.getSocket()!.emit("endQuiz");
              setQuizState("finished");
            }}
          >
            End Quiz
          </Button>
        </div>
      </div>
    </Background>
  );
}

export default QuizManager;
