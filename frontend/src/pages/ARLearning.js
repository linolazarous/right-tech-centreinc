import React, { useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const ARLearning = () => {
  const [lessonName, setLessonName] = useState("");
  const [arContent, setArContent] = useState("");
  const [lesson, setLesson] = useState(null);

  const createLesson = async () => {
    try {
      const response = await axios.post("/api/arlearning/create", {
        lessonName,
        arContent,
      });
      setLesson(response.data);
    } catch (error) {
      console.error("Error creating lesson:", error);
    }
  };

  return (
    <div>
      <Navbar />
      <h1>Create AR Lesson</h1>
      <input
        type="text"
        placeholder="Lesson Name"
        value={lessonName}
        onChange={(e) => setLessonName(e.target.value)}
      />
      <textarea
        placeholder="AR Content"
        value={arContent}
        onChange={(e) => setArContent(e.target.value)}
      />
      <button onClick={createLesson}>Create Lesson</button>
      {lesson && <pre>{JSON.stringify(lesson, null, 2)}</pre>}
      <Footer />
    </div>
  );
};

export default ARLearning;