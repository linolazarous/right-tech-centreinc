import React, { useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const ContentModeration = () => {
  const [content, setContent] = useState("");
  const [moderationResult, setModerationResult] = useState("");

  const moderateContent = async () => {
    try {
      const response = await axios.post("/api/moderation/moderate", {
        content,
      });
      setModerationResult(response.data.moderationResult);
    } catch (error) {
      console.error("Error moderating content:", error);
    }
  };

  return (
    <div>
      <Navbar />
      <h1>Content Moderation</h1>
      <textarea
        placeholder="Enter content to moderate"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <button onClick={moderateContent}>Moderate</button>
      {moderationResult && (
        <div>
          <h2>Moderation Result</h2>
          <p>{moderationResult}</p>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default ContentModeration;