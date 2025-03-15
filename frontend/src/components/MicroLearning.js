import React, { useEffect, useState } from "react";
import axios from "axios";

const MicroLearning = () => {
  const [lessons, setLessons] = useState([]);

  useEffect(() => {
    axios.get("/api/microlearning")
      .then((response) => setLessons(response.data))
      .catch((error) => console.error(error));
  }, []);

  return (
    <div>
      <h1>Microlearning Lessons</h1>
      <ul>
        {lessons.map((lesson) => (
          <li key={lesson.id}>
            <h2>{lesson.title}</h2>
            <p>{lesson.content}</p>
            <p>Duration: {lesson.duration} mins</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MicroLearning;