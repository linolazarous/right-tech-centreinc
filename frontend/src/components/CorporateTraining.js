import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { requestTraining } from '../services/corporateService';

const CorporateTraining = ({ companyId }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    employees: '',
    topics: '',
    timeline: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      setError('');
      await requestTraining({ ...formData, companyId });
      setSubmitted(true);
    } catch (err) {
      setError('Failed to submit request. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="corporate-success">
        <h1>Thank You!</h1>
        <p>Your corporate training request has been received.</p>
        <p>Our team will contact you within 24 hours to discuss your needs.</p>
      </div>
    );
  }

  return (
    <div className="corporate-training">
      <h1>Corporate Training Solutions</h1>
      <p className="subtitle">Custom training programs tailored to your business needs</p>
      
      <div className="benefits-grid">
        <div className="benefit-card">
          <h3>Custom Curriculum</h3>
          <p>Training programs designed specifically for your team's needs</p>
        </div>
        <div className="benefit-card">
          <h3>Flexible Delivery</h3>
          <p>On-site, virtual, or hybrid training options</p>
        </div>
        <div className="benefit-card">
          <h3>Expert Instructors</h3>
          <p>Industry professionals with real-world experience</p>
        </div>
      </div>
      
      <div className="request-form">
        <h2>Request Information</h2>
        {error && <div className="error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Contact Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Number of Employees</label>
            <select
              name="employees"
              value={formData.employees}
              onChange={handleChange}
              required
            >
              <option value="">Select...</option>
              <option value="1-10">1-10</option>
              <option value="11-50">11-50</option>
              <option value="51-100">51-100</option>
              <option value="100+">100+</option>
            </select>
          </div>
          <div className="form-group">
            <label>Training Topics of Interest</label>
            <textarea
              name="topics"
              placeholder="e.g., Leadership development, Technical skills, etc."
              value={formData.topics}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Desired Timeline</label>
            <input
              type="text"
              name="timeline"
              placeholder="e.g., Within 3 months"
              value={formData.timeline}
              onChange={handleChange}
            />
          </div>
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Submitting...' : 'Submit Request'}
          </button>
        </form>
      </div>
    </div>
  );
};

CorporateTraining.propTypes = {
  companyId: PropTypes.string
};

export default CorporateTraining;
