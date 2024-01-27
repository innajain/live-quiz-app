import React from "react";
import { Background } from "../components";
import { BackArrow, Delete, LeftArrow, RightArrow } from "../assets/svgs";
import { sendApiRequest } from "../api requests/sendApiRequest";
import { useNavigate } from "react-router-dom";

type Problem = {
  question: string;
  options: string[];
  timeAlloted: number;
  correctAnswer: number | undefined;
};

const CreateQuizContext = React.createContext<{
  currentProblemIndex: number;
  setCurrentProblemIndex: React.Dispatch<React.SetStateAction<number>>;
  problems: Problem[];
  setProblems: React.Dispatch<React.SetStateAction<Problem[]>>;
  navigator: ReturnType<typeof useNavigate>;
  message: string | undefined;
  setMessage: React.Dispatch<React.SetStateAction<string | undefined>>;
}>({
  currentProblemIndex: 0,
  setCurrentProblemIndex: () => {},
  problems: [],
  setProblems: () => {},
  navigator: () => {},
  message: undefined,
  setMessage: () => {},
});

function CreateQuiz() {
  const [loginStatus, setLoginStatus] = React.useState<"waiting"| "unauthorised" | "logged in">("waiting");
  const [currentProblemIndex, setCurrentProblemIndex] = React.useState(0);
  const [problems, setProblems] = React.useState<Problem[]>([
    {
      question: "",
      options: ["", "", "", ""],
      timeAlloted: 30,
      correctAnswer: undefined,
    },
  ]);
  const [message, setMessage] = React.useState<string | undefined>(undefined);
  const navigator = useNavigate();

  React.useEffect(() => {
    sendApiRequest("/authorised", {
      emailId: localStorage.getItem("emailId"),
      password: localStorage.getItem("password"),
    }).then((response) => {
      if (response.success) {
        setLoginStatus("logged in");
      }
      else{
        setLoginStatus("unauthorised");
      }
    });
  });

  if (loginStatus !== "logged in")
    return (
      <Background>
        <div className="h-[100vh] flex flex-col justify-center text-xl">
          {loginStatus== "unauthorised"? "Please login first" : "Loading..."}
        </div>
      </Background>
    );
  return (
    <CreateQuizContext.Provider
      value={{
        currentProblemIndex,
        setCurrentProblemIndex,
        problems,
        setProblems,
        navigator,
        message,
        setMessage,
      }}
    >
      <Background>
        <Arrows />
        <TopSection />
        <QuestionAndOptions />

        {currentProblemIndex === problems.length - 1 && (
          <div className="absolute right-4 bottom-4 flex items-end flex-col ">
            {message && <div className="py-4 text-red-400">{message}</div>}

            <button
              className=" bg-green-400 p-2 rounded-lg text-green-900 font-bold
          hover:bg-green-300 active:bg-green-400"
              onClick={() => {
                if (problems.some((problem) => problem.question === "")) {
                  setMessage("Please enter a question for all problems");
                  return;
                }
                if (
                  problems.some(
                    (problem) => problem.correctAnswer === undefined
                  )
                ) {
                  setMessage(
                    "Please select the correct answer for all problems"
                  );
                  return;
                }
                setMessage("Loading...");
                sendApiRequest("/authorised/saveDraftQuiz", {
                  emailId: localStorage.getItem("emailId"),
                  password: localStorage.getItem("password"),
                  problemsArray: problems,
                }).then((response) => {
                  setMessage(response.message);
                  if (response.success) {
                  }
                });
              }}
            >
              Save Quiz
            </button>
          </div>
        )}
      </Background>
    </CreateQuizContext.Provider>
  );
}

function TopSection() {
  const { currentProblemIndex, problems } = React.useContext(CreateQuizContext);
  return (
    <div className="absolute top-0 w-full flex [&>*]:w-[33%] items-center p-2">
      <div>
        <BackArrowButton />
      </div>
      <div className="flex justify-center">
        <TimeSection />
      </div>

      <div className="flex gap-4 items-center justify-end">
        <DeleteButton />
        <p className="text-gray-400 select-none ">
          Problem: {currentProblemIndex + 1}/{problems.length}
        </p>
      </div>
    </div>
  );
}

function BackArrowButton() {
  const { navigator } = React.useContext(CreateQuizContext);

  return (
    <button
      className="text-gray-400 select-none
          [&>*]:size-8 [&>*]:fill-slate-400
          hover:bg-slate-700 active:bg-slate-600 rounded-lg p-2"
      onClick={() => {
        navigator("/dashboard");
      }}
    >
      <BackArrow />
    </button>
  );
}

function TimeSection() {
  const { currentProblemIndex, problems, setProblems } =
    React.useContext(CreateQuizContext);

  return (
    <div className="text-slate-300 font-bold select-none">
      Time Alloted:{" "}
      {
        <input
          type="text"
          className="bg-transparent focus:outline-none w-[36px] h-fit overflow-hidden text-center bg-slate-500 rounded-md"
          value={problems[currentProblemIndex].timeAlloted}
          onChange={(e) => {
            setProblems((problems) => {
              const numericValue = Number(
                e.target.value.replace(/[^0-9]/g, "")
              );

              problems[currentProblemIndex].timeAlloted = Number(numericValue);
              const width = numericValue.toString().length * 8 + 20; // Adjust the multiplier and offset as needed
              e.target.style.width = `${width}px`;
              return [...problems];
            });
          }}
        />
      }{" "}
      sec
    </div>
  );
}

function DeleteButton() {
  const { currentProblemIndex, setCurrentProblemIndex, problems, setProblems } =
    React.useContext(CreateQuizContext);

  return (
    <button
      className="[&>*]:size-6 [&>*]:fill-red-500
              hover:bg-slate-700 active:bg-slate-600 rounded-lg p-2
              disabled:hover:bg-transparent disabled:active:bg-transparent disabled:opacity-50"
      onClick={() => {
        setProblems((problems) => {
          problems.splice(currentProblemIndex, 1);
          return [...problems];
        });
        if (currentProblemIndex > 0) {
          setCurrentProblemIndex(currentProblemIndex - 1);
        }
      }}
      disabled={problems.length === 1}
    >
      <Delete />
    </button>
  );
}
function Arrows() {
  return (
    <>
      <LeftOrRightArrows type="left" />
      <LeftOrRightArrows type="right" />
    </>
  );
}

function LeftOrRightArrows({ type }: { type: "left" | "right" }) {
  const { currentProblemIndex, setCurrentProblemIndex, problems, setProblems } =
    React.useContext(CreateQuizContext);

  function gotoPrevQuestion() {
    if (currentProblemIndex > 0) {
      setCurrentProblemIndex(currentProblemIndex - 1);
    }
  }

  function gotoNextQuestion() {
    if (currentProblemIndex == problems.length - 1) {
      setProblems((problems) => [
        ...problems,
        {
          question: "",
          options: ["", "", "", ""],
          timeAlloted: 30,
          correctAnswer: undefined,
        },
      ]);
    }
    setCurrentProblemIndex(currentProblemIndex + 1);
  }

  return (
    <div
      className={`w-20 h-20 bg-slate-600 hover:bg-slate-500 active:bg-slate-600 rounded-lg fixed
  top-[50%] translate-y-[-50%] flex justify-center items-center 
  [&>*]:size-14 [&>*]:fill-slate-400
  ${type == "left" ? "left-1" : "right-1"} `}
      onClick={type == "left" ? gotoPrevQuestion : gotoNextQuestion}
    >
      {type == "left" ? <LeftArrow /> : <RightArrow />}
    </div>
  );
}

function QuestionAndOptions() {
  const { currentProblemIndex, problems, setProblems } =
    React.useContext(CreateQuizContext);
  return (
    <div className=" flex flex-col items-center w-[1000px] mt-8 mb-16">
      <textarea
        className="font-bold text-5xl text-center select-none focus:outline-none w-full 
          h-fit bg-transparent resize-none overflow-y-hidden mt-44"
        value={problems[currentProblemIndex].question}
        placeholder="Enter your question here"
        onChange={(e) => {
          setProblems((problems) => {
            problems[currentProblemIndex].question = e.target.value;
            return [...problems];
          });
          e.target.style.height = "auto";
          e.target.style.height = e.target.scrollHeight + "px";
        }}
        style={{
          lineHeight: "1.5",
        }}
      />

      <div className="flex flex-col gap-3 mt-20 items-center w-fit min-w-[300px] select-none">
        {problems[currentProblemIndex].options.map((option, index) => (
          <button
            key={index}
            className={`hover:bg-gray-600 active:bg-gray-700 font-bold py-2 px-4 rounded min-h-10 flex 
              justify-center w-full
              ${
                problems[currentProblemIndex].correctAnswer === index
                  ? "bg-gray-700"
                  : ""
              } 
              `}
            onClick={() =>
              setProblems((problems) => {
                problems[currentProblemIndex].correctAnswer = index;
                return [...problems];
              })
            }
          >
            <input
              placeholder={`Option ${index + 1}`}
              value={option}
              onChange={(e) => {
                setProblems((problems) => {
                  problems[currentProblemIndex].options[index] = e.target.value;
                  return [...problems];
                });
                e.target.style.width = "auto";
                e.target.style.width = e.target.scrollWidth + "px";
              }}
              className="bg-transparent focus:outline-none h-fit overflow-x-hidden max-w-[500px] text-center"
            />
          </button>
        ))}
      </div>
    </div>
  );
}

export default CreateQuiz;
