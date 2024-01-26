const BASE_URL = "https://live-quiz-app-backend.vercel.app/";

export const sendApiRequest = async (path: string, body: any): Promise<{success: boolean, message? : string, data? : any}> => {
  const response = fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })
    .then((res) => res.json())
    return response;
};
