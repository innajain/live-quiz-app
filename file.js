fetch("https://live-quiz-app-backend.vercel.app/try",
    {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        
    }
).then((res) => res.json()).then((data) => {
    console.log(data)});