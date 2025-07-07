import React, { useState } from "react";
import axios from "axios";
import PropTypes from 'prop-types';

const FeedbackForumForm = ({ userId }) => {
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ success: false, message: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!feedback.trim() || rating === 0) {
      setSubmitStatus({ success: false, message: 'Please provide both feedback and rating' });
      return;
    }

    setIsSubmitting(true);
    try {
      await axios.post("/api/feedback", { 
        userId,
        feedback,
        rating,
        timestamp: new Date().toISOString()
      });
      setSubmitStatus({ success: true, message: 'Thank you for your valuable feedback!' });
      setFeedback("");
      setRating(0);
    } catch (error) {
      console.error("Feedback submission error:", error);
      setSubmitStatus({ 
        success: false, 
        message: 'Failed to submit feedback. Please try again later.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="feedback-form">
      <h2>Share Your Feedback</h2>
      {submitStatus.message && (
        <div className={`status-message ${submitStatus.success ? 'success' : 'error'}`}>
          {submitStatus.message}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Your Rating</label>
          <div className="rating-stars">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`star ${star <= rating ? 'filled' : ''}`}
                onClick={() => setRating(star)}
              >
                ★
              </span>
            ))}
          </div>
        </div>
        
        <div className="form-group">
          <label>Your Feedback</label>
          <textarea
            placeholder="What did you like or how can we improve?"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            minLength="10"
            required
          />
        </div>
        
        <button 
          type="submit" 
          disabled={isSubmitting || !feedback.trim() || rating === 0}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
        </button>
      </form>
    </div>
  );
};

FeedbackForumForm.propTypes = {
  userId: PropTypes.string.isRequired
};

export default FeedbackForumForm;
