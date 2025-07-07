import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getVRLabs, joinVRLab } from '../services/vrLabService';
import { FaVrCardboard, FaUserFriends, FaClock, FaDoorOpen } from 'react-icons/fa';

const VRLab = ({ userId }) => {
  const [labs, setLabs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('available');

  useEffect(() => {
    const fetchLabs = async () => {
      try {
        setIsLoading(true);
        setError('');
        const data = await getVRLabs(userId);
        setLabs(data);
      } catch (err) {
        console.error('VR lab error:', err);
        setError('Failed to load VR labs');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLabs();
  }, [userId]);

  const handleJoinLab = async (labId) => {
    try {
      setIsLoading(true);
      const session = await joinVRLab(userId, labId);
      // In a real app, this would redirect to the VR lab
      console.log('VR lab session:', session);
      window.open(session.joinUrl, '_blank');
    } catch (err) {
      console.error('Join error:', err);
      setError('Failed to join VR lab');
    } finally {
      setIsLoading(false);
    }
  };

  const availableLabs = labs.filter(lab => lab.status === 'available');
  const inProgressLabs = labs.filter(lab => lab.status === 'in-progress');

  if (isLoading) return <div className="loading">Loading VR labs...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="vr-lab-container">
      <h1 className="vr-lab-header">
        <FaVrCardboard /> VR Learning Labs
      </h1>
      <p className="subheader">
        Immersive virtual reality learning experiences
      </p>

      <div className="vr-lab-tabs">
        <button
          className={`tab-button ${activeTab === 'available' ? 'active' : ''}`}
          onClick={() => setActiveTab('available')}
        >
          Available Labs
        </button>
        <button
          className={`tab-button ${activeTab === 'progress' ? 'active' : ''}`}
          onClick={() => setActiveTab('progress')}
        >
          Labs in Progress
        </button>
      </div>

      <div className="vr-lab-grid">
        {(activeTab === 'available' ? availableLabs : inProgressLabs).length === 0 ? (
          <div className="no-labs">
            No {activeTab === 'available' ? 'available' : 'in-progress'} VR labs
          </div>
        ) : (
          (activeTab === 'available' ? availableLabs : inProgressLabs).map(lab => (
            <div key={lab.id} className="vr-lab-card">
              <div className="vr-lab-image">
                <img src={lab.image} alt={lab.title} />
                <div className="vr-lab-badge">{lab.type}</div>
              </div>
              <div className="vr-lab-content">
                <h3>{lab.title}</h3>
                <p className="vr-lab-description">{lab.description}</p>
                <div className="vr-lab-meta">
                  <span className="meta-item">
                    <FaClock /> {lab.duration} minutes
                  </span>
                  <span className="meta-item">
                    <FaUserFriends /> {lab.participants}/{lab.capacity} spots
                  </span>
                </div>
                <div className="vr-lab-skills">
                  <h4>Skills Covered:</h4>
                  <div className="skill-tags">
                    {lab.skills.map((skill, index) => (
                      <span key={index} className="skill-tag">{skill}</span>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => handleJoinLab(lab.id)}
                  disabled={isLoading}
                  className="join-lab-button"
                >
                  <FaDoorOpen /> {activeTab === 'available' ? 'Join Lab' : 'Rejoin Lab'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

VRLab.propTypes = {
  userId: PropTypes.string.isRequired
};

export default VRLab;
