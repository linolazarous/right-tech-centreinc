import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { assessSkill, getSkillCategories, getUserSkillHistory } from '../services/skillAssessmentService';
import SkillRadarChart from './SkillRadarChart';
import { FaChartLine, FaClipboardCheck, FaHistory } from 'react-icons/fa';

const SkillsAssessment = ({ userId }) => {
  const [skillCategories, setSkillCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('');
  const [assessmentResult, setAssessmentResult] = useState(null);
  const [skillHistory, setSkillHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('assess');

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsLoading(true);
        const [categories, history] = await Promise.all([
          getSkillCategories(),
          getUserSkillHistory(userId)
        ]);
        setSkillCategories(categories);
        setSkillHistory(history);
      } catch (err) {
        console.error('Skills assessment error:', err);
        setError('Failed to load skill data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, [userId]);

  const handleAssess = async () => {
    if (!selectedSkill) {
      setError('Please select a skill to assess');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      const result = await assessSkill(userId, selectedSkill);
      setAssessmentResult(result);
      // Refresh history after new assessment
      const history = await getUserSkillHistory(userId);
      setSkillHistory(history);
    } catch (err) {
      console.error('Assessment error:', err);
      setError('Failed to complete skill assessment');
    } finally {
      setIsLoading(false);
    }
  };

  const getSkillsForCategory = () => {
    const category = skillCategories.find(c => c.id === selectedCategory);
    return category ? category.skills : [];
  };

  if (isLoading && !assessmentResult) {
    return <div className="loading">Loading skill assessment data...</div>;
  }

  return (
    <div className="skills-assessment-container">
      <h1 className="skills-header">
        <FaClipboardCheck /> Skills Assessment
      </h1>
      <p className="subheader">
        Evaluate and track your technical skill proficiency
      </p>

      <div className="assessment-tabs">
        <button
          className={`tab-button ${activeTab === 'assess' ? 'active' : ''}`}
          onClick={() => setActiveTab('assess')}
        >
          New Assessment
        </button>
        <button
          className={`tab-button ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          <FaHistory /> Assessment History
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      {activeTab === 'assess' ? (
        <div className="assessment-form">
          <div className="form-group">
            <label htmlFor="category">Skill Category</label>
            <select
              id="category"
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setSelectedSkill('');
              }}
            >
              <option value="">Select a category</option>
              {skillCategories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {selectedCategory && (
            <div className="form-group">
              <label htmlFor="skill">Skill</label>
              <select
                id="skill"
                value={selectedSkill}
                onChange={(e) => setSelectedSkill(e.target.value)}
                disabled={!selectedCategory}
              >
                <option value="">Select a skill</option>
                {getSkillsForCategory().map(skill => (
                  <option key={skill.id} value={skill.id}>
                    {skill.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {selectedSkill && (
            <button
              onClick={handleAssess}
              disabled={isLoading}
              className="assess-button"
            >
              {isLoading ? 'Assessing...' : 'Assess My Skill'}
            </button>
          )}

          {assessmentResult && (
            <div className="assessment-result">
              <h3>Assessment Result</h3>
              <div className="result-details">
                <div className="score">
                  <span className="label">Skill:</span>
                  <span className="value">{assessmentResult.skill}</span>
                </div>
                <div className="score">
                  <span className="label">Proficiency:</span>
                  <span className={`value level-${assessmentResult.level}`}>
                    {assessmentResult.level} ({assessmentResult.score}/100)
                  </span>
                </div>
                <div className="feedback">
                  <span className="label">Feedback:</span>
                  <p>{assessmentResult.feedback}</p>
                </div>
                <div className="recommendations">
                  <span className="label">Recommendations:</span>
                  <ul>
                    {assessmentResult.recommendations.map((rec, index) => (
                      <li key={index}>{rec}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="assessment-history">
          {skillHistory.length === 0 ? (
            <div className="no-history">
              No assessment history available. Complete your first assessment to see progress.
            </div>
          ) : (
            <>
              <div className="skills-chart">
                <h3>
                  <FaChartLine /> Your Skill Progression
                </h3>
                <SkillRadarChart data={skillHistory} />
              </div>

              <div className="history-list">
                <h3>Detailed Assessment History</h3>
                <table>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Skill</th>
                      <th>Score</th>
                      <th>Level</th>
                    </tr>
                  </thead>
                  <tbody>
                    {skillHistory.map((assessment, index) => (
                      <tr key={index}>
                        <td>{new Date(assessment.date).toLocaleDateString()}</td>
                        <td>{assessment.skill}</td>
                        <td>{assessment.score}</td>
                        <td className={`level-${assessment.level}`}>
                          {assessment.level}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

SkillsAssessment.propTypes = {
  userId: PropTypes.string.isRequired
};

export default SkillsAssessment;
