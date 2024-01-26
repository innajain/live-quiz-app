import React, { useEffect } from "react";
import {  useParams } from "react-router-dom";
import { Background, Button } from "../components";
import { sendApiRequest } from "../api requests/sendApiRequest";

function DraftQuiz() {
  const { draftQuizId } = useParams<{ draftQuizId: string }>();
  const [message, setMessage] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    sendApiRequest("/authorised/getUserData", {
      emailId: "abc",
      password: "123",
    }).then((res) => {
      if (res.success) {
        
      } else setMessage(res.message!);
    });
  }, []);
  return (
    <Background>
      <div className="flex flex-col gap-5 text-white items-center">
        <Button
          onClick={() => {
            setLoading(true);
            sendApiRequest("/authorised/floatQuiz", {
              draftQuizId,
              emailId: "abc",
              password: "123",
            }).then((res) => {
              if (res.success) {
                window.location.replace(`http://localhost:5173/QM/quiz/${res.data.quizId}`);
                return;
              }
              setLoading(false);
              setMessage(res.message!);
            });
          }}
        >
          Float Quiz
        </Button>
        {loading && <div>Loading...</div>}
        {message && <div>{message}</div>}
      </div>
    </Background>
  );
}

export default DraftQuiz;
