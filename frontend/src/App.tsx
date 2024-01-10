import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import JoinQuiz from "./routes/JoinQuiz";
import Signup from "./routes/Signup";
import Login from "./routes/Login";
import Quiz from "./routes/Quiz";
import DraftQuiz from "./routes/DraftQuiz";
import QuizManager from "./routes/QuizManager";
import QuizScreen from "./routes/Temp";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<JoinQuiz />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/quiz/:quizId" element={<Quiz />} />
        <Route path="/QM/quiz/:quizId" element={<QuizManager />} />
        <Route path="/draftQuiz/:draftQuizId" element={<DraftQuiz />} />
        <Route path="/temp" element={<QuizScreen/>}/>
        <Route path="/*" element={<div>Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
