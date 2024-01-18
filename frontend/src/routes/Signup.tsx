import React from "react";
import { Background, Button, Input } from "../components";
import { sendApiRequest } from "../api requests/sendApiRequest";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [name, setName] = React.useState("");
  const [emailId, setEmailId] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [showOTPBox, setShowOTPBox] = React.useState(false);
  const [otp, setOtp] = React.useState("");
  const navigator = useNavigate();

  return (
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
              navigator("/");
            }}
          >
            Join quiz
          </button>
        </div>
        <div className="flex flex-col w-[300px] gap-2 relative bg-slate-950 p-5  rounded-xl  mt-52">
          <Input
            disabled={loading || showOTPBox}
            placeholder="Name"
            onChange={(e) => {
              if (message) setMessage("");
              setName(e.target.value);
            }}
            value={name}
          />
          <Input
            placeholder="Email ID"
            disabled={loading || showOTPBox}
            onChange={(e) => {
              if (message) setMessage("");
              setEmailId(e.target.value);
            }}
            value={emailId}
          />
          <Input
            placeholder="Create Password"
            disabled={loading}
            onChange={(e) => {
              if (message) setMessage("");
              setPassword(e.target.value);
            }}
            value={password}
          />
          {showOTPBox && (
            <Input
              style={{ marginTop: "30px" }}
              placeholder="Enter OTP"
              disabled={loading}
              onChange={(e) => {
                if (message) setMessage("");
                setOtp(e.target.value);
              }}
              value={otp}
            />
          )}
          {!showOTPBox && (
            <Button
              onClick={() => {
                setLoading(true);
                sendApiRequest("/signup", {
                  name,
                  emailId,
                  password,
                }).then((res) => {
                  setLoading(false);
                  setMessage(res.message!);
                  if (!res.success) {
                    return;
                  }
                  setShowOTPBox(true);
                });
              }}
              disabled={loading}
            >
              Signup
            </Button>
          )}
          {showOTPBox && (
            <Button
              onClick={() => {
                const otpNum = parseInt(otp);
                setLoading(true);
                sendApiRequest("/otpVerify", {
                  emailId,
                  otp: otpNum,
                }).then((res) => {
                  setLoading(false);
                  setMessage(res.message!);
                  if (!res.success) {
                    return;
                  }
                  localStorage.setItem("emailId", emailId);
                  localStorage.setItem("password", password);
                  navigator("/dashboard", {
                    replace: true,
                  });
                });
              }}
              disabled={loading}
            >
              Verify OTP
            </Button>
          )}
        </div>
        {loading && <p className="text-white font-bold mt-4">Loading...</p>}
        {message && <p className="text-white font-bold mt-4">{message}</p>}
      </div>
    </Background>
  );
}


export default Signup;
