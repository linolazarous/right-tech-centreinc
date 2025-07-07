import React, { useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { FaUniversity, FaSpinner } from 'react-icons/fa';

const Metaverse = ({ userId }) => {
  const [formData, setFormData] = useState({
    campusName: '',
    description: '',
    capacity: 50,
    isPublic: true
  });
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');
  const [createdCampus, setCreatedCampus] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.campusName.trim()) {
      setError('Campus name is required');
      return;
    }

    setIsCreating(true);
    setError('');
    try {
      const response = await axios.post('/api/metaverse/create', {
        ...formData,
        creatorId: userId
      });
      setCreatedCampus(response.data);
    } catch (err) {
      console.error('Campus creation error:', err);
      setError(err.response?.data?.message || 'Failed to create virtual campus');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="metaverse-container">
      <h1 className="metaverse-title">
        <FaUniversity /> Virtual Campus Builder
      </h1>

      {error && <div className="error-message">{error}</div>}

      {createdCampus ? (
        <div className="creation-success">
          <h2>Successfully created "{createdCampus.name}"!</h2>
          <p>Campus ID: {createdCampus.id}</p>
          <button 
            onClick={() => setCreatedCampus(null)}
            className="create-another"
          >
            Create Another Campus
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="campus-form">
          <div className="form-group">
            <label htmlFor="campusName">Campus Name</label>
            <input
              type="text"
              id="campusName"
              name="campusName"
              placeholder="e.g., Digital Innovation Hub"
              value={formData.campusName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              placeholder="Describe your virtual campus..."
              value={formData.description}
              onChange={handleChange}
              rows="3"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="capacity">Max Capacity</label>
              <input
                type="number"
                id="capacity"
                name="capacity"
                min="10"
                max="500"
                value={formData.capacity}
                onChange={handleChange}
              />
            </div>

            <div className="form-group checkbox-group">
              <input
                type="checkbox"
                id="isPublic"
                name="isPublic"
                checked={formData.isPublic}
                onChange={handleChange}
              />
              <label htmlFor="isPublic">Public Campus</label>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isCreating}
            className="submit-button"
          >
            {isCreating ? (
              <>
                <FaSpinner className="spinner" /> Creating...
              </>
            ) : 'Create Virtual Campus'}
          </button>
        </form>
      )}
    </div>
  );
};

Metaverse.propTypes = {
  userId: PropTypes.string.isRequired
};

export default Metaverse;
