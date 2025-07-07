import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getVRLearningModules } from '../services/vrLearningService';
import { FaVrCardboard, FaBookOpen, FaUserGraduate, FaFilter, FaArrowLeft } from 'react-icons/fa';

const VRLearning = ({ userId }) => {
  const [modules, setModules] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedModule, setSelectedModule] = useState(null);

  useEffect(() => {
    const fetchModules = async () => {
      try {
        setIsLoading(true);
        setError('');
        const data = await getVRLearningModules(userId);
        setModules(data);
      } catch (err) {
        console.error('VR learning error:', err);
        setError('Failed to load VR learning modules. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchModules();
  }, [userId]);

  const filteredModules = activeCategory === 'all' 
    ? modules 
    : modules.filter(module => module.category === activeCategory);

  const categories = ['all', ...new Set(modules.map(module => module.category))];

  const handleModuleSelect = (module) => {
    setSelectedModule(module);
  };

  const handleBackToList = () => {
    setSelectedModule(null);
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
    color: '#3498db'
  };

  const subtitleStyle = {
    color: '#7f8c8d',
    fontSize: '1.1rem'
  };

  const filterContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '20px',
    gap: '10px'
  };

  const selectStyle = {
    padding: '8px 12px',
    borderRadius: '4px',
    border: '1px solid #bdc3c7',
    backgroundColor: 'white',
    fontSize: '1rem'
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '20px',
    marginTop: '20px'
  };

  const cardStyle = {
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    padding: '20px',
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s',
    backgroundColor: 'white',
    ':hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
    }
  };

  const cardIconStyle = {
    fontSize: '2rem',
    color: '#3498db',
    marginBottom: '15px'
  };

  const detailContainerStyle = {
    backgroundColor: '#f9f9f9',
    padding: '30px',
    borderRadius: '8px',
    maxWidth: '800px',
    margin: '0 auto'
  };

  const backButtonStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    marginBottom: '20px',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    color: '#3498db',
    fontSize: '1rem'
  };

  const vrPlaceholderStyle = {
    backgroundColor: '#e8f4fc',
    padding: '40px',
    textAlign: 'center',
    borderRadius: '8px',
    margin: '20px 0'
  };

  const loadingStyle = {
    textAlign: 'center',
    padding: '40px',
    fontSize: '1.2rem'
  };

  if (isLoading) return (
    <div style={loadingStyle}>
      <div className="spinner"></div>
      <p>Loading VR learning content...</p>
    </div>
  );

  if (error) return (
    <div style={{ textAlign: 'center', padding: '40px' }}>
      <p style={{ color: '#e74c3c' }}>{error}</p>
      <button 
        style={{
          padding: '8px 16px',
          backgroundColor: '#3498db',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
        onClick={() => window.location.reload()}
      >
        Retry
      </button>
    </div>
  );

  if (selectedModule) {
    return (
      <div style={containerStyle}>
        <button onClick={handleBackToList} style={backButtonStyle}>
          <FaArrowLeft /> Back to modules
        </button>
        <div style={detailContainerStyle}>
          <h2 style={{ color: '#2c3e50', marginBottom: '15px' }}>{selectedModule.title}</h2>
          <div style={vrPlaceholderStyle}>
            <FaVrCardboard size={64} style={{ color: '#3498db' }} />
            <p style={{ fontSize: '1.2rem', margin: '15px 0' }}>VR Experience: {selectedModule.title}</p>
            <button 
              style={{
                padding: '10px 20px',
                backgroundColor: '#3498db',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '1rem'
              }}
            >
              Enter VR Mode
            </button>
          </div>
          <div style={{ marginTop: '20px' }}>
            <p><strong>Description:</strong> {selectedModule.description}</p>
            <p><strong>Duration:</strong> {selectedModule.duration} minutes</p>
            <p><strong>Skills:</strong> {selectedModule.skills.join(', ')}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <header style={headerStyle}>
        <h1>
          <FaVrCardboard style={headerIconStyle} /> Immersive VR Learning
        </h1>
        <p style={subtitleStyle}>Explore interactive virtual reality experiences</p>
      </header>

      <div style={filterContainerStyle}>
        <FaFilter style={{ color: '#7f8c8d' }} />
        <select
          value={activeCategory}
          onChange={(e) => setActiveCategory(e.target.value)}
          style={selectStyle}
        >
          {categories.map(category => (
            <option key={category} value={category}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div style={gridStyle}>
        {filteredModules.length > 0 ? (
          filteredModules.map(module => (
            <div 
              key={module.id} 
              style={cardStyle}
              onClick={() => handleModuleSelect(module)}
            >
              <div style={cardIconStyle}>
                {module.category === 'education' ? <FaBookOpen /> : <FaUserGraduate />}
              </div>
              <h3 style={{ margin: '10px 0', color: '#2c3e50' }}>{module.title}</h3>
              <p style={{ color: '#7f8c8d', marginBottom: '15px' }}>{module.shortDescription}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#3498db' }}>{module.duration} min</span>
                <span style={{ 
                  backgroundColor: '#e8f4fc',
                  color: '#3498db',
                  padding: '3px 8px',
                  borderRadius: '4px',
                  fontSize: '0.8rem'
                }}>
                  {module.level}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px' }}>
            <p>No VR modules found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
};

VRLearning.propTypes = {
  userId: PropTypes.string.isRequired
};

export default VRLearning;
