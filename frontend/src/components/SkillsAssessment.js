import React, { useState } from 'react';
  import { assessSkill } from '../services/skillAssessmentService';

  const SkillAssessment = () => {
      const [skill, setSkill] = useState('');
      const [result, setResult] = useState(null);

      const handleAssess = async () => {
          const userId = localStorage.getItem('userId');
          const assessment = await assessSkill(userId, skill);
          setResult(assessment);
      };

      return (
          <div>
              <h1>Skill Assessment</h1>
              <input
                  type="text"
                  placeholder="Enter Skill"
                  value={skill}
                  onChange={(e) => setSkill(e.target.value)}
              />
              <button onClick={handleAssess}>Assess</button>
              {result && (
                  <div>
                      <p>Score: {result.score}</p>
                  </div>
              )}
          </div>
      );
  };

  export default SkillAssessment;