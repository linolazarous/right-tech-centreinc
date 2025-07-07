import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { askVirtualTutor, getTutorHistory } from '../services/virtualTutorService';
import { FaRobot, FaPaperPlane, FaUser, FaSpinner } from 'react-icons/fa';

const VirtualTutor = ({ userId }) => {
  const [question, setQuestion] = useState('');
  const [conversation, setConversation] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setIsLoading(true);
        const history = await getTutorHistory(userId);
        setConversation(history);
      } catch (err) {
        console.error('History error:', err);
        setError('Failed to load conversation history');
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, [userId]);

  useEffect(() => {
    scrollToBottom();
  }, [conversation]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: question,
      timestamp: new Date().toISOString()
    };

    setConversation(prev => [...prev, userMessage]);
    setQuestion('');
    setIsLoading(true);
    setError('');

    try {
      const response = await askVirtualTutor(userId, question);
      const tutorMessage = {
        id: Date.now() + 1,
        sender: 'tutor',
        text: response.answer,
        timestamp: new Date().toISOString(),
        sources: response.sources
      };
      setConversation(prev => [...prev, tutorMessage]);
    } catch (err) {
      console.error('Tutor error:', err);
      setError('Failed to get response from tutor');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="virtual-tutor-container">
      <h1 className="tutor-header">
        <FaRobot /> Virtual Tutor
      </h1>
      <p className="subheader">
        Get personalized help with your learning questions
      </p>

      <div className="chat-container">
        <div className="chat-messages">
          {conversation.length === 0 ? (
            <div className="empty-chat">
              <p>Ask your virtual tutor anything about your courses or learning topics</p>
              <div className="example-questions">
                <h4>Example questions:</h4>
                <ul>
                  <li>"Explain the concept of recursion in programming"</li>
                  <li>"Help me solve this math problem: 2x + 5 = 15"</li>
                  <li>"What's the difference between React props and state?"</li>
                </ul>
              </div>
            </div>
          ) : (
            conversation.map((msg) => (
              <div
                key={msg.id}
                className={`message ${msg.sender}`}
              >
                <div className="message-header">
                  {msg.sender === 'user' ? (
                    <FaUser className="user-icon" />
                  ) : (
                    <FaRobot className="tutor-icon" />
                  )}
                  <span className="message-time">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <div className="message-content">{msg.text}</div>
                {msg.sender === 'tutor' && msg.sources && (
                  <div className="message-sources">
                    <h5>Sources:</h5>
                    <ul>
                      {msg.sources.map((source, index) => (
                        <li key={index}>
                          <a href={source.url} target="_blank" rel="noopener noreferrer">
                            {source.title}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))
          )}
          {isLoading && (
            <div className="message tutor">
              <div className="message-header">
                <FaRobot className="tutor-icon" />
              </div>
              <div className="message-content">
                <FaSpinner className="spinner" /> Thinking...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSubmit} className="chat-input">
          <input
            type="text"
            placeholder="Ask your tutor a question..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !question.trim()}
            className="send-button"
          >
            <FaPaperPlane />
          </button>
        </form>
      </div>

      {error && <div className="error">{error}</div>}
    </div>
  );
};

VirtualTutor.propTypes = {
  userId: PropTypes.string.isRequired
};

export default VirtualTutor;
