fetch("https://live-quiz-app-backend.vercel.app/joinQuiz", 
    {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        
        mode: "cors",
    }
).then((res) => res.json()).then((data) => {
    console.log(data)});