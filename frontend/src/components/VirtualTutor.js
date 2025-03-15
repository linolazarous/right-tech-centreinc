import React, { useState } from "react";
import axios from "axios";

const VirtualTutor = ({ userId }) => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const askTutor = async () => {
    try {
      const response = await axios.post("/api/virtualtutor/ask", {
        userId,
        question,
      });
      setAnswer(response.data.answer);
    } catch (error) {
      console.error("Error asking tutor:", error);
    }
  };

  return (
    <div>
      <h1>Virtual Tutor</h1>
      <input
        type="text"
        placeholder="Ask a question"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />
      <button onClick={askTutor}>Ask</button>
      {answer && <p>{answer}</p>}
    </div>
  );
};

export default VirtualTutor;