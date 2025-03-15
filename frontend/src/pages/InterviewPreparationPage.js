import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import InterviewPreparation from "../components/InterviewPreparation";

const InterviewPreparationPage = () => {
  return (
    <div>
      <Navbar />
      <h1>Interview Preparation</h1>
      <InterviewPreparation />
      <Footer />
    </div>
  );
};

export default InterviewPreparationPage;