import React, { useState } from "react";
import axios from "axios";

const FeedbackForm = () => {
  const [feedback, setFeedback] = useState("");

  const submitFeedback = async () => {
    try {
      await axios.post("/api/feedback", { feedback });
      alert("Thank you for your feedback!");
    } catch (error) {
      console.error("Error submitting feedback:", error);
    }
  };

  return (
    <div>
      <textarea
        placeholder="Enter your feedback"
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
      />
      <button onClick={submitFeedback}>Submit Feedback</button>
    </div>
  );
};

export default FeedbackForm;