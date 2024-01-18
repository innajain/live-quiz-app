import React, { useEffect } from "react";
import { Background } from "../components";

function QuizScreen() {
  
}

export default QuizScreen;

export function ProblemScreen({
  problem: {
    question,
    options,
    correctAnswer,
    currentProblemIndex,
    totalProblemsCount,
    selectedOption,
    setSelectedOption,
    timeAlloted,
  },
}: {
  problem: {
    question: string;
    options: string[];
    correctAnswer?: number;
    currentProblemIndex: number;
    totalProblemsCount: number;
    selectedOption?: number;
    setSelectedOption: React.Dispatch<React.SetStateAction<number | undefined>>;
    timeAlloted: number;
  };
}) {
  const [availableTime, setAvailableTime] = React.useState<number>(5);

  useEffect(() => {
    console.log("first")
    setAvailableTime(timeAlloted);
    const timer = setInterval(() => {
        setAvailableTime((t) => {
          if (t === 0) {
            clearInterval(timer);
            return 0;
          }
          return t - 1;
        });
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [currentProblemIndex]);
  return (
    <Background>
      <div className="absolute text-gray-400 top-4 right-4 select-none">
        Problem: {currentProblemIndex + 1}/{totalProblemsCount}
      </div>
      <div className="mt-28 flex flex-col items-center mb-16">
        <div className=" text-gray-400 top-4 left-4 select-none text-xl">
          {correctAnswer == undefined && availableTime
            ? `Time remaining:  ${availableTime} sec`
            : "Time's up!"}
        </div>
        <div className=" flex flex-col items-center w-[1000px] mt-24">
          <div className="font-bold text-5xl  text-center select-none">
            {question}
          </div>
          <div className="flex flex-col gap-3 mt-20 items-center w-fit min-w-[300px] select-none">
            {options.map((option, index) => (
              <button
                key={index}
                className={`${
                  selectedOption==undefined && availableTime && "hover:bg-gray-600 active:bg-gray-700"
                  
                } font-bold py-2 px-4 rounded w-full  ${
                  correctAnswer === index
                    ? "bg-green-500 hover:bg-green-500"
                    : ""
                } ${
                  selectedOption != undefined &&
                  correctAnswer != undefined &&
                  selectedOption != correctAnswer &&
                  selectedOption === index
                    ? "bg-red-500 hover:bg-red-500"
                    : ""
                }
              ${
                selectedOption != undefined &&
                correctAnswer === undefined &&
                selectedOption === index
                  ? "bg-gray-700"
                  : ""
              } ${(selectedOption!==undefined || availableTime===0) && "cursor-default"}
              `}
                onClick={() => selectedOption===undefined && availableTime &&  setSelectedOption(index)}
              >
                {option}
              </button>
            ))}
          </div>
          <div id="bottomMessageArea" className="text-xl text-gray-400 mt-16">
            {availableTime === 0 && correctAnswer === undefined
              ? "Waiting for answer to come"
              : ""}

            {correctAnswer !== undefined && selectedOption === undefined
              ? "You didn't select any option"
              : ""}
            {correctAnswer !== undefined && selectedOption === correctAnswer
              ? "Correct Answer! 🎉"
              : ""}
            {correctAnswer !== undefined &&
            selectedOption !== undefined &&
            selectedOption !== correctAnswer
              ? "Wrong Answer! 😢"
              : ""}
          </div>
        </div>
      </div>
    </Background>
  );
}
