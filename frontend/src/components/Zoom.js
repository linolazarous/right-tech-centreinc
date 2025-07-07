import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FaVideo, FaCalendarAlt, FaSearch, FaTimes } from 'react-icons/fa';

const Zoom = ({ userId }) => {
  const [meetingId, setMeetingId] = useState('');
  const [activeTab, setActiveTab] = useState('join');
  const [scheduledMeetings, setScheduledMeetings] = useState([]);
  
  const handleJoinMeeting = () => {
    console.log(`Joining meeting: ${meetingId}`);
    // Actual implementation would use Zoom SDK
  };

  const handleScheduleMeeting = () => {
    const newMeeting = {
      id: Date.now(),
      title: `Meeting ${scheduledMeetings.length + 1}`,
      date: new Date(Date.now() + 86400000).toLocaleDateString(),
      time: '14:00'
    };
    setScheduledMeetings([...scheduledMeetings, newMeeting]);
  };

  // Styles
  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
  };

  const headerStyle = {
    textAlign: 'center',
    marginBottom: '40px',
    color: '#2c3e50'
  };

  const headerIconStyle = {
    verticalAlign: 'middle',
    marginRight: '10px',
    color: '#2d8cff'
  };

  const tabContainerStyle = {
    display: 'flex',
    borderBottom: '1px solid #e0e0e0',
    marginBottom: '20px'
  };

  const tabStyle = {
    padding: '10px 20px',
    cursor: 'pointer',
    borderBottom: '3px solid transparent',
    ':hover': {
      backgroundColor: '#f5f5f5'
    }
  };

  const activeTabStyle = {
    ...tabStyle,
    borderBottom: '3px solid #2d8cff',
    fontWeight: 'bold'
  };

  const inputStyle = {
    padding: '10px',
    width: '100%',
    maxWidth: '400px',
    borderRadius: '4px',
    border: '1px solid #bdc3c7',
    fontSize: '1rem',
    margin: '10px 0'
  };

  const buttonStyle = {
    padding: '10px 20px',
    backgroundColor: '#2d8cff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
    margin: '10px 0',
    ':hover': {
      backgroundColor: '#1a7ae8'
    }
  };

  const meetingCardStyle = {
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    padding: '15px',
    margin: '10px 0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  };

  return (
    <div style={containerStyle}>
      <header style={headerStyle}>
        <h1>
          <FaVideo style={headerIconStyle} /> Zoom Integration
        </h1>
        <p style={{ color: '#7f8c8d', fontSize: '1.1rem' }}>
          Seamlessly connect with your classes and meetings
        </p>
      </header>

      <div style={tabContainerStyle}>
        <div 
          style={activeTab === 'join' ? activeTabStyle : tabStyle}
          onClick={() => setActiveTab('join')}
        >
          Join Meeting
        </div>
        <div 
          style={activeTab === 'schedule' ? activeTabStyle : tabStyle}
          onClick={() => setActiveTab('schedule')}
        >
          Schedule Meeting
        </div>
        <div 
          style={activeTab === 'scheduled' ? activeTabStyle : tabStyle}
          onClick={() => setActiveTab('scheduled')}
        >
          My Scheduled
        </div>
      </div>

      {activeTab === 'join' && (
        <div style={{ textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FaSearch style={{ marginRight: '10px', color: '#7f8c8d' }} />
            <input
              type="text"
              placeholder="Enter Meeting ID or Personal Link Name"
              value={meetingId}
              onChange={(e) => setMeetingId(e.target.value)}
              style={inputStyle}
            />
          </div>
          <button onClick={handleJoinMeeting} style={buttonStyle}>
            Join Meeting
          </button>
        </div>
      )}

      {activeTab === 'schedule' && (
        <div style={{ textAlign: 'center' }}>
          <button onClick={handleScheduleMeeting} style={buttonStyle}>
            <FaCalendarAlt style={{ marginRight: '8px' }} /> Schedule New Meeting
          </button>
        </div>
      )}

      {activeTab === 'scheduled' && (
        <div>
          {scheduledMeetings.length > 0 ? (
            scheduledMeetings.map(meeting => (
              <div key={meeting.id} style={meetingCardStyle}>
                <div>
                  <h3 style={{ margin: '0 0 5px 0', color: '#2c3e50' }}>{meeting.title}</h3>
                  <p style={{ margin: '0', color: '#7f8c8d' }}>
                    {meeting.date} at {meeting.time}
                  </p>
                </div>
                <button 
                  style={{
                    ...buttonStyle,
                    backgroundColor: '#e74c3c',
                    padding: '5px 10px',
                    ':hover': {
                      backgroundColor: '#c0392b'
                    }
                  }}
                >
                  <FaTimes /> Cancel
                </button>
              </div>
            ))
          ) : (
            <p style={{ textAlign: 'center', color: '#7f8c8d' }}>
              No scheduled meetings. Schedule one to see it here.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

Zoom.propTypes = {
  userId: PropTypes.string.isRequired
};

export default Zoom;
