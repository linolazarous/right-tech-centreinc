import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getAvailableScholarships, applyForScholarship } from '../services/scholarshipService';
import ScholarshipCard from './ScholarshipCard';
import { FaGraduationCap, FaSearch, FaMoneyBillWave } from 'react-icons/fa';

const Scholarship = ({ userId }) => {
  const [scholarships, setScholarships] = useState([]);
  const [appliedScholarships, setAppliedScholarships] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('available');

  useEffect(() => {
    const fetchScholarships = async () => {
      try {
        setIsLoading(true);
        setError('');
        const [available, applied] = await Promise.all([
          getAvailableScholarships(userId),
          getAvailableScholarships(userId, true) // Get applied scholarships
        ]);
        setScholarships(available);
        setAppliedScholarships(applied);
      } catch (err) {
        console.error('Scholarship error:', err);
        setError('Failed to load scholarship data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchScholarships();
  }, [userId]);

  const handleApply = async (scholarshipId) => {
    try {
      setIsLoading(true);
      await applyForScholarship(userId, scholarshipId);
      // Refresh the list after applying
      const [available, applied] = await Promise.all([
        getAvailableScholarships(userId),
        getAvailableScholarships(userId, true)
      ]);
      setScholarships(available);
      setAppliedScholarships(applied);
    } catch (err) {
      console.error('Application error:', err);
      setError('Failed to apply for scholarship');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredScholarships = scholarships.filter(scholarship =>
    scholarship.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    scholarship.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) return <div className="loading">Loading scholarship information...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="scholarship-container">
      <div className="scholarship-header">
        <h1>
          <FaGraduationCap /> Scholarship Opportunities
        </h1>
        <p className="subheader">
          Financial support for your education journey
        </p>
      </div>

      <div className="scholarship-tabs">
        <button
          className={`tab-button ${activeTab === 'available' ? 'active' : ''}`}
          onClick={() => setActiveTab('available')}
        >
          Available Scholarships
        </button>
        <button
          className={`tab-button ${activeTab === 'applied' ? 'active' : ''}`}
          onClick={() => setActiveTab('applied')}
        >
          My Applications
        </button>
      </div>

      {activeTab === 'available' && (
        <div className="available-scholarships">
          <div className="search-bar">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search scholarships..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {filteredScholarships.length === 0 ? (
            <div className="no-results">
              No scholarships match your search criteria
            </div>
          ) : (
            <div className="scholarship-grid">
              {filteredScholarships.map(scholarship => (
                <ScholarshipCard
                  key={scholarship.id}
                  scholarship={scholarship}
                  onApply={handleApply}
                  isApplied={appliedScholarships.some(s => s.id === scholarship.id)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'applied' && (
        <div className="applied-scholarships">
          {appliedScholarships.length === 0 ? (
            <div className="no-applications">
              <FaMoneyBillWave className="icon" />
              <p>You haven't applied for any scholarships yet</p>
              <button onClick={() => setActiveTab('available')}>
                Browse Available Scholarships
              </button>
            </div>
          ) : (
            <div className="application-list">
              {appliedScholarships.map(scholarship => (
                <div key={scholarship.id} className="application-card">
                  <h3>{scholarship.name}</h3>
                  <p className="amount">Amount: ${scholarship.amount}</p>
                  <p className="status">
                    Status: <span className={scholarship.status.toLowerCase()}>{scholarship.status}</span>
                  </p>
                  <p className="deadline">
                    Decision Date: {new Date(scholarship.decisionDate).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="scholarship-footer">
        <p>
          Need help with your applications? Contact our scholarship advisor at scholarships@righttechcentre.com
        </p>
      </div>
    </div>
  );
};

Scholarship.propTypes = {
  userId: PropTypes.string.isRequired
};

export default Scholarship;
