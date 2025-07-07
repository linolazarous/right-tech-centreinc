import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import axios from "axios";
import InterviewQuestion from './InterviewQuestion';

const InterviewPreparation = ({ userId }) => {
  const [jobRole, setJobRole] = useState("");
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userResponses, setUserResponses] = useState({});
  const [feedback, setFeedback] = useState({});
  const [sessionId, setSessionId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchQuestions = async () => {
    if (!jobRole.trim()) {
      setError('Please enter a job role');
      return;
    }

    setIsLoading(true);
    setError('');
    try {
      const response = await axios.post("/api/interview/questions", {
        jobRole,
        userId
      });
      setQuestions(response.data.questions);
      setSessionId(response.data.sessionId);
      setCurrentQuestionIndex(0);
    } catch (error) {
      console.error("Error fetching questions:", error);
      setError('Failed to fetch questions. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResponseChange = (questionId, response) => {
    setUserResponses(prev => ({
      ...prev,
      [questionId]: response
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const submitInterview = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post("/api/interview/analyze", {
        sessionId,
        userId,
        responses: userResponses
      });
      setFeedback(response.data.feedback);
    } catch (error) {
      console.error("Error analyzing interview:", error);
      setError('Failed to analyze interview. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="interview-preparation">
      <h1>Interview Preparation</h1>
      
      {!sessionId ? (
        <div className="interview-setup">
          <div className="form-group">
            <label>Target Job Role</label>
            <input
              type="text"
              placeholder="e.g., Frontend Developer, Data Scientist"
              value={jobRole}
              onChange={(e) => setJobRole(e.target.value)}
            />
          </div>
          <button 
            onClick={fetchQuestions}
            disabled={isLoading || !jobRole.trim()}
          >
            {isLoading ? 'Preparing Questions...' : 'Start Practice'}
          </button>
          {error && <div className="error">{error}</div>}
        </div>
      ) : feedback.overallScore ? (
        <div className="interview-feedback">
          <h2>Interview Results</h2>
          <div className="score-section">
            <h3>Overall Score: {feedback.overallScore}/10</h3>
            <p>{feedback.summary}</p>
          </div>
          
          <div className="detailed-feedback">
            <h3>Question-by-Question Feedback</h3>
            {questions.map((question, index) => (
              <div key={question.id} className="question-feedback">
                <h4>Question {index + 1}: {question.text}</h4>
                <p><strong>Your Response:</strong> {userResponses[question.id] || 'No response'}</p>
                <p><strong>Feedback:</strong> {feedback.detailedFeedback[question.id]}</p>
              </div>
            ))}
          </div>
          
          <button 
            onClick={() => {
              setSessionId(null);
              setFeedback({});
              setUserResponses({});
            }}
          >
            Start New Interview
          </button>
        </div>
      ) : questions.length > 0 ? (
        <div className="interview-session">
          <div className="progress-indicator">
            Question {currentQuestionIndex + 1} of {questions.length}
          </div>
          
          <InterviewQuestion
            question={questions[currentQuestionIndex]}
            response={userResponses[questions[currentQuestionIndex].id] || ''}
            onResponseChange={handleResponseChange}
          />
          
          <div className="navigation-buttons">
            <button 
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
            >
              Previous
            </button>
            
            {currentQuestionIndex < questions.length - 1 ? (
              <button onClick={handleNextQuestion}>Next</button>
            ) : (
              <button 
                onClick={submitInterview}
                disabled={isLoading}
              >
                {isLoading ? 'Analyzing...' : 'Submit Interview'}
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="loading">Preparing your interview questions...</div>
      )}
    </div>
  );
};

InterviewPreparation.propTypes = {
  userId: PropTypes.string.isRequired
};

export default InterviewPreparation;
