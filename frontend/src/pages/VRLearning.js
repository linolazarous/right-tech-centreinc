import React, { useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const VRLearning = () => {
  const [lessonName, setLessonName] = useState("");
  const [vrContent, setVrContent] = useState("");
  const [lesson, setLesson] = useState(null);

  const createLesson = async () => {
    try {
      const response = await axios.post("/api/vrlearning/create", {
        lessonName,
        vrContent,
      });
      setLesson(response.data);
    } catch (error) {
      console.error("Error creating lesson:", error);
    }
  };

  return (
    <div>
      <Navbar />
      <h1>Create VR Lesson</h1>
      <input
        type="text"
        placeholder="Lesson Name"
        value={lessonName}
        onChange={(e) => setLessonName(e.target.value)}
      />
      <textarea
        placeholder="VR Content"
        value={vrContent}
        onChange={(e) => setVrContent(e.target.value)}
      />
      <button onClick={createLesson}>Create Lesson</button>
      {lesson && <pre>{JSON.stringify(lesson, null, 2)}</pre>}
      <Footer />
    </div>
  );
};

export default VRLearning;