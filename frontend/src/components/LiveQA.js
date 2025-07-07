import React, { useState } from 'react';
import { scheduleLiveQA } from '../services/liveQAService';
import PropTypes from 'prop-types';
import { FaCalendarAlt, FaChalkboardTeacher } from 'react-icons/fa';

const LiveQA = ({ userId }) => {
  const [sessionData, setSessionData] = useState({
    topic: '',
    date: '',
    duration: 30,
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ success: false, message: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSessionData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!sessionData.topic || !sessionData.date) {
      setSubmitStatus({ success: false, message: 'Topic and date are required' });
      return;
    }

    setIsSubmitting(true);
    try {
      const session = await scheduleLiveQA({
        ...sessionData,
        userId,
        datetime: new Date(sessionData.date).toISOString()
      });
      setSubmitStatus({ 
        success: true, 
        message: `Session "${session.topic}" scheduled for ${new Date(session.datetime).toLocaleString()}`
      });
      // Reset form after successful submission
      setSessionData({
        topic: '',
        date: '',
        duration: 30,
        description: ''
      });
    } catch (error) {
      console.error('Session scheduling error:', error);
      setSubmitStatus({ 
        success: false, 
        message: error.response?.data?.message || 'Failed to schedule session' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="live-qa-container">
      <h1 className="live-qa-title">
        <FaChalkboardTeacher /> Schedule Live Q&A Session
      </h1>
      
      {submitStatus.message && (
        <div className={`submit-status ${submitStatus.success ? 'success' : 'error'}`}>
          {submitStatus.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="live-qa-form">
        <div className="form-group">
          <label htmlFor="topic">Session Topic</label>
          <input
            type="text"
            id="topic"
            name="topic"
            placeholder="What will this session be about?"
            value={sessionData.topic}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="date">
              <FaCalendarAlt /> Date & Time
            </label>
            <input
              type="datetime-local"
              id="date"
              name="date"
              value={sessionData.date}
              onChange={handleChange}
              min={new Date().toISOString().slice(0, 16)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="duration">Duration (minutes)</label>
            <select
              id="duration"
              name="duration"
              value={sessionData.duration}
              onChange={handleChange}
            >
              <option value="30">30</option>
              <option value="60">60</option>
              <option value="90">90</option>
              <option value="120">120</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            placeholder="Provide details about the session..."
            value={sessionData.description}
            onChange={handleChange}
            rows="4"
          />
        </div>

        <button 
          type="submit" 
          disabled={isSubmitting}
          className="submit-button"
        >
          {isSubmitting ? 'Scheduling...' : 'Schedule Session'}
        </button>
      </form>
    </div>
  );
};

LiveQA.propTypes = {
  userId: PropTypes.string.isRequired
};

export default LiveQA;
