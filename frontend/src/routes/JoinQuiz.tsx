import React, {
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  forwardRef,
  useEffect,
} from "react";
import { sendApiRequest } from "../api requests/sendApiRequest";
import { useNavigate } from "react-router-dom";
import { SocketManager } from "../api requests/SocketManager";
import { Background, Button, Input } from "../components";

function JoinQuiz() {
  const [quizId, setQuizId] = React.useState("");
  const [name, setName] = React.useState("inna");
  const navigator = useNavigate();
  const [message, setMessage] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [bottomInfoContainerHeight, setBottomInfoContainerHeight] =
    React.useState(0);
  const inputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.target.id === "bottomInfoContainer") {
          setBottomInfoContainerHeight(entry.target.clientHeight);
        }
      }
    });

    const bottomInfoContainer = document.getElementById("bottomInfoContainer");
    if (bottomInfoContainer) {
      resizeObserver.observe(bottomInfoContainer);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  const output = (
    <Background>
      <div className="h-[100vh] flex items-center">

      <div className="flex flex-col w-[300px] gap-2 relative bg-slate-950 p-5 rounded-xl group abc">
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
        <div
          id="bottomInfoContainer"
          style={{ bottom: -bottomInfoContainerHeight - 20 }}
          className={`absolute flex flex-col items-center left-0  right-0`}
        >
          {loading && <p className="text-white font-bold">Loading...</p>}
          <p className="text-white font-bold">{message}</p>
        </div>
      </div>
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
      quizId: (quizId),
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
