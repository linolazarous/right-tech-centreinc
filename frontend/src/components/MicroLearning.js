import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import MicroLessonCard from './MicroLessonCard';
import { FaFilter, FaSearch, FaClock } from 'react-icons/fa';

const MicroLearning = ({ userId }) => {
  const [lessons, setLessons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [durationFilter, setDurationFilter] = useState('all');

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        setIsLoading(true);
        setError('');
        const response = await axios.get('/api/microlearning', {
          params: { userId }
        });
        setLessons(response.data);
      } catch (err) {
        console.error('Error fetching micro lessons:', err);
        setError('Failed to load microlearning lessons');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLessons();
  }, [userId]);

  const filteredLessons = lessons.filter(lesson => {
    const matchesSearch = lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         lesson.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDuration = durationFilter === 'all' || 
                          (durationFilter === 'short' && lesson.duration <= 5) ||
                          (durationFilter === 'medium' && lesson.duration > 5 && lesson.duration <= 15) ||
                          (durationFilter === 'long' && lesson.duration > 15);
    return matchesSearch && matchesDuration;
  });

  if (isLoading) return <div className="loading">Loading microlearning content...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="microlearning-container">
      <h1>Microlearning Library</h1>
      <p className="subtitle">Quick knowledge bites for on-the-go learning</p>

      <div className="lesson-controls">
        <div className="search-bar">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search lessons..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="duration-filter">
          <FaFilter className="filter-icon" />
          <select
            value={durationFilter}
            onChange={(e) => setDurationFilter(e.target.value)}
          >
            <option value="all">All Durations</option>
            <option value="short">Short (≤5 min)</option>
            <option value="medium">Medium (5-15 min)</option>
            <option value="long">Long (>15 min)</option>
          </select>
        </div>
      </div>

      {filteredLessons.length === 0 ? (
        <div className="no-lessons">
          No lessons match your search criteria
        </div>
      ) : (
        <div className="lessons-grid">
          {filteredLessons.map(lesson => (
            <MicroLessonCard 
              key={lesson.id} 
              lesson={lesson}
              userId={userId}
            />
          ))}
        </div>
      )}
    </div>
  );
};

MicroLearning.propTypes = {
  userId: PropTypes.string.isRequired
};

export default MicroLearning;
