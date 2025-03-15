import React, { useState } from "react";
import axios from "axios";

const InterviewPreparation = () => {
  const [jobRole, setJobRole] = useState("");
  const [questions, setQuestions] = useState("");
  const [userResponses, setUserResponses] = useState("");
  const [feedback, setFeedback] = useState("");

  const fetchQuestions = async () => {
    try {
      const response = await axios.post("/api/interview/questions", {
        jobRole,
      });
      setQuestions(response.data.questions);
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  const conductInterview = async () => {
    try {
      const response = await axios.post("/api/interview/mock-interview", {
        jobRole,
        userResponses,
      });
      setFeedback(response.data.feedback);
    } catch (error) {
      console.error("Error conducting interview:", error);
    }
  };

  return (
    <div>
      <h1>Interview Preparation</h1>
      <input
        type="text"
        placeholder="Enter Job Role"
        value={jobRole}
        onChange={(e) => setJobRole(e.target.value)}
      />
      <button onClick={fetchQuestions}>Get Questions</button>
      {questions && (
        <div>
          <h2>Interview Questions</h2>
          <pre>{questions}</pre>
          <textarea
            placeholder="Your Responses"
            value={userResponses}
            onChange={(e) => setUserResponses(e.target.value)}
          />
          <button onClick={conductInterview}>Conduct Mock Interview</button>
        </div>
      )}
      {feedback && (
        <div>
          <h2>Feedback</h2>
          <pre>{feedback}</pre>
        </div>
      )}
    </div>
  );
};

export default InterviewPreparation;