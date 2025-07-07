import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getVirtualLabs, startVirtualLab } from '../services/virtualLabService';
import { FaFlask, FaPlay, FaClock, FaUserFriends } from 'react-icons/fa';

const VirtualLab = ({ userId }) => {
  const [labs, setLabs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeLab, setActiveLab] = useState(null);

  useEffect(() => {
    const fetchLabs = async () => {
      try {
        setIsLoading(true);
        setError('');
        const data = await getVirtualLabs(userId);
        setLabs(data);
      } catch (err) {
        console.error('Virtual lab error:', err);
        setError('Failed to load virtual labs');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLabs();
  }, [userId]);

  const handleStartLab = async (labId) => {
    try {
      setIsLoading(true);
      const labSession = await startVirtualLab(userId, labId);
      setActiveLab(labSession);
      // In a real app, this would redirect to the lab interface
      console.log('Lab session started:', labSession);
    } catch (err) {
      console.error('Lab start error:', err);
      setError('Failed to start virtual lab');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <div className="loading">Loading virtual labs...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="virtual-lab-container">
      <h1 className="lab-header">
        <FaFlask /> Virtual Labs
      </h1>
      <p className="subheader">
        Hands-on learning in a simulated environment
      </p>

      {activeLab && (
        <div className="active-lab">
          <h2>Currently Active: {activeLab.name}</h2>
          <button className="enter-lab-button">
            Enter Lab Environment
          </button>
        </div>
      )}

      <div className="lab-grid">
        {labs.map(lab => (
          <div key={lab.id} className="lab-card">
            <div className="lab-image">
              <img src={lab.image} alt={lab.title} />
            </div>
            <div className="lab-content">
              <h3>{lab.title}</h3>
              <p className="lab-description">{lab.description}</p>
              <div className="lab-meta">
                <span className="meta-item">
                  <FaClock /> {lab.duration} mins
                </span>
                <span className="meta-item">
                  <FaUserFriends /> {lab.difficulty}
                </span>
              </div>
              <div className="lab-skills">
                <h4>Skills Practiced:</h4>
                <div className="skill-tags">
                  {lab.skills.map((skill, index) => (
                    <span key={index} className="skill-tag">{skill}</span>
                  ))}
                </div>
              </div>
              <button
                onClick={() => handleStartLab(lab.id)}
                disabled={isLoading}
                className="start-lab-button"
              >
                <FaPlay /> Start Lab
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

VirtualLab.propTypes = {
  userId: PropTypes.string.isRequired
};

export default VirtualLab;
