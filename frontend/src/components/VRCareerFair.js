import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getVREvents, registerForEvent } from '../services/vrCareerService';
import { FaCalendarAlt, FaUserFriends, FaMapMarkerAlt, FaTicketAlt } from 'react-icons/fa';

const VRCareerFair = ({ userId }) => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('upcoming');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        setError('');
        const data = await getVREvents(userId);
        setEvents(data);
      } catch (err) {
        console.error('VR events error:', err);
        setError('Failed to load career fair events');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, [userId]);

  const handleRegister = async (eventId) => {
    try {
      setIsLoading(true);
      await registerForEvent(userId, eventId);
      // Refresh events after registration
      const updated = await getVREvents(userId);
      setEvents(updated);
    } catch (err) {
      console.error('Registration error:', err);
      setError('Failed to register for event');
    } finally {
      setIsLoading(false);
    }
  };

  const upcomingEvents = events.filter(event => new Date(event.date) > new Date());
  const pastEvents = events.filter(event => new Date(event.date) <= new Date());

  if (isLoading) return <div className="loading">Loading career fairs...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="vr-career-container">
      <h1 className="career-header">
        VR Career Fairs
      </h1>
      <p className="subheader">
        Network with employers in immersive virtual environments
      </p>

      <div className="career-tabs">
        <button
          className={`tab-button ${activeTab === 'upcoming' ? 'active' : ''}`}
          onClick={() => setActiveTab('upcoming')}
        >
          Upcoming Events
        </button>
        <button
          className={`tab-button ${activeTab === 'past' ? 'active' : ''}`}
          onClick={() => setActiveTab('past')}
        >
          Past Events
        </button>
      </div>

      <div className="events-grid">
        {(activeTab === 'upcoming' ? upcomingEvents : pastEvents).length === 0 ? (
          <div className="no-events">
            No {activeTab} VR career fairs available
          </div>
        ) : (
          (activeTab === 'upcoming' ? upcomingEvents : pastEvents).map(event => (
            <div key={event.id} className="event-card">
              <div className="event-image">
                <img src={event.image} alt={event.name} />
              </div>
              <div className="event-content">
                <h3>{event.name}</h3>
                <div className="event-meta">
                  <span className="meta-item">
                    <FaCalendarAlt /> {new Date(event.date).toLocaleDateString()}
                  </span>
                  <span className="meta-item">
                    <FaUserFriends /> {event.attendees} attending
                  </span>
                  <span className="meta-item">
                    <FaMapMarkerAlt /> {event.location}
                  </span>
                </div>
                <p className="event-description">{event.description}</p>
                <div className="event-companies">
                  <h4>Featured Companies:</h4>
                  <div className="company-logos">
                    {event.companies.map((company, index) => (
                      <img
                        key={index}
                        src={company.logo}
                        alt={company.name}
                        title={company.name}
                      />
                    ))}
                  </div>
                </div>
                {activeTab === 'upcoming' && (
                  <button
                    onClick={() => handleRegister(event.id)}
                    disabled={event.registered || isLoading}
                    className={`register-button ${event.registered ? 'registered' : ''}`}
                  >
                    {event.registered ? (
                      <>
                        <FaTicketAlt /> Registered
                      </>
                    ) : (
                      'Register Now'
                    )}
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

VRCareerFair.propTypes = {
  userId: PropTypes.string.isRequired
};

export default VRCareerFair;
