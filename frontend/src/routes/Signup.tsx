import React from 'react'
import { sendApiRequest, } from '../api requests/sendApiRequest'
import { useNavigate } from 'react-router-dom'

function Signup() {
    const [name, setName] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [emailId, setEmailId] = React.useState('')
    const [otpSent, setOtpSent] = React.useState(false)
    const [enteredOtp, setEnteredOtp] = React.useState<number>()
    const navigate = useNavigate()
function navigateTo(path:string){
    navigate(path)
}
    return (
        <div>
            <input type="text" onChange={(e) => {
                setName(e.target.value)
            }} placeholder='Name' disabled={otpSent}/>
            <br />
            <input type="text" onChange={(e) => {
                setEmailId(e.target.value)
            }} placeholder='Password' disabled={otpSent} />
            <br />
            <input type="text" onChange={(e) => {
                setPassword(e.target.value)
            }} placeholder='Email ID' disabled={otpSent} />
            <br />
            <br />
            <button onClick={() => {
                sendApiRequest("/signup", { name, emailId, password }).then((res) => {
                    if (res.success) {
                        setOtpSent(true)
                    }
                })
            }} disabled={otpSent}>Submit</button><br /><br />
            {otpSent && <div>
                Enter OTP: <input type="text" onChange={(e) => {
                    setEnteredOtp(Number.parseInt(e.target.value))
                }} />
                <button onClick={() => {
                  sendApiRequest("/otpVerify", { emailId, otp: enteredOtp }).then((res) => {
                    if(res.success){
                      navigateTo("/login")
                    }
                    else{
                      setOtpSent(false)
                    }
                  })
                }}>Submit</button>

            </div>}
        </div>)
}

export default Signup