import React, { ReactElement, useEffect } from "react";
import { Background } from "../components";
import { sendApiRequest } from "../api requests/sendApiRequest";
import {
  GymnasticsSVG,
  LogoutSVG,
  PlusSVG,
  RocketSVG,
  UserSVG,
  WorldSVG,
} from "../assets/svgs";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [userData, setUserData] = React.useState<any>();
  const navigator = useNavigate();
  const [message, setMessage] = React.useState<string>("Loading...");

  useEffect(() => {
    sendApiRequest("/authorised/getUserData", {
      emailId: localStorage.getItem("emailId") || "",
      password: localStorage.getItem("password") || "",
    }).then((res) => {
      if (!res.success) {
        setMessage("Please login first");
        return;
      }
      setUserData(res.data);
    });
  }, []);

  if (!userData)
    return (
      <Background>
        <div className="h-[100vh] flex flex-col justify-center text-xl">
          {message}
        </div>
      </Background>
    );

  return (
    <Background>
      <button
        onClick={() => {
          localStorage.removeItem("emailId");
          localStorage.removeItem("password");
          navigator("/login");
        }}
      >
        <div className="h-16 w-16 rounded-xl hover:bg-slate-800 flex items-center justify-center absolute right-3 top-3">
          <div className="h-10 w-10 border-slate-400 border-[3px] rounded-xl flex justify-center items-center [&>*]:fill-slate-400 [&>*]:size-6">
            <LogoutSVG />
          </div>
        </div>
      </button>
      <div className="mt-36 flex flex-col items-center justify-around gap-12">
        <div className="flex justify-around gap-12">
          <button
            onClick={() => {
              navigator("createQuiz");
            }}
          >
            <Box>{<PlusSVG />}</Box>
          </button>
          <button
            onClick={() => {
              navigator("joinQuizAuth");
            }}
          >
            <Box>{<RocketSVG />}</Box>
          </button>
          <button
            onClick={() => {
              navigator("draftQuizzes");
            }}
          >
            <Box>{<WorldSVG />}</Box>
          </button>
        </div>
        <div className="flex justify-around gap-12">
          <button
            onClick={() => {
              navigator("pastQuizzes");
            }}
          >
            <Box>{<GymnasticsSVG />}</Box>
          </button>
          <button
            onClick={() => {
              navigator("account");
            }}
          >
            <Box>{<UserSVG />}</Box>
          </button>
        </div>
      </div>
    </Background>
  );
}

export default Dashboard;

function Box({ children }: { children: ReactElement }) {
  return (
    <div className="h-48 w-48 rounded-3xl hover:bg-slate-800 flex items-center justify-center ">
      <div className="h-32 w-32 border-slate-400 border-4 rounded-3xl flex justify-center items-center [&>*]:fill-slate-400 [&>*]:size-20">
        {children}
      </div>
    </div>
  );
}
