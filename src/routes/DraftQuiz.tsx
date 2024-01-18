import React, { useEffect } from "react";
import { redirect, useNavigate, useParams } from "react-router-dom";
import { Background, Button } from "../components";
import { sendApiRequest } from "../api requests/sendApiRequest";

function DraftQuiz() {
  const { draftQuizId } = useParams<{ draftQuizId: string }>();
  const [message, setMessage] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const navigator = useNavigate();
  let draftQuiz = {};

  useEffect(() => {
    sendApiRequest("/authorised/getUserData", {
      emailId: "abc",
      password: "123",
    }).then((res) => {
      if (res.success) {
        draftQuiz = res.data.draftQuizzes.find(
          (quiz: any) => quiz.quizId === draftQuizId
        );
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
                console.log("first")
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
