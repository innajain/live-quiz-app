import React from "react";
import { sendApiRequest } from "../api requests/sendApiRequest";
import { useNavigate } from "react-router-dom";
import { Background, Button, Input } from "../components";

function JoinQuiz() {
  const [quizId, setQuizId] = React.useState("");
  const [name, setName] = React.useState("");
  const navigator = useNavigate();
  const [message, setMessage] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  React.useState(0);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const output = (
    <Background>
      <div className="h-[100vh] flex items-center flex-col">
        <div className="flex justify-evenly mt-10 w-52 underline text-slate-200">
          <button
            onClick={() => {
              navigator("/login");
            }}
          >
            Login
          </button>
          |
          <button
            onClick={() => {
              navigator("/signup");
            }}
          >
            Signup
          </button>
        </div>
        <div className="flex flex-col w-[300px] gap-2 relative bg-slate-950 p-5 rounded-xl mt-52">
          <Input
            ref={inputRef}
            disabled={loading}
            placeholder="Quiz Id"
            onChange={(e) => {
              if (message) setMessage("");
              setQuizId(e.target.value);
            }}
            value={quizId}
          />
          <Input
            placeholder="Name"
            disabled={loading}
            onChange={(e) => {
              if (message) setMessage("");
              setName(e.target.value);
            }}
            value={name}
          />
          <Button onClick={() => joinQuizHandler()} disabled={loading}>
            Join Quiz
          </Button>
        </div>
        {loading || message && <div className={`flex flex-col items-center mt-4`}>
          {loading && <p className="text-white font-bold">Loading...</p>}
          <p className="text-white font-bold">{message}</p>
        </div>}
      </div>
    </Background>
  );

  function joinQuizHandler() {
    if (quizId == "") {
      setMessage("Enter Quiz Id");
      return;
    }
    if (quizId.length != 8 || isNaN(Number.parseInt(quizId))) {
      setMessage("Invalid Quiz Id");
      return;
    }
    if (name == "") {
      setMessage("Enter a Name");
      return;
    }
    if (message) setMessage("");
    setLoading(true);
    sendApiRequest("/joinQuiz", {
      quizId: quizId,
      name,
    }).then((res) => {
      setLoading(false);
      if (!res.success) {
        setLoading(false);
        setMessage("Quiz not found");
        return;
      }

      navigator(`/quiz/${quizId}/`, { state: { userId: res.data.userId } });
    });
  }

  return output;
}

export default JoinQuiz;
