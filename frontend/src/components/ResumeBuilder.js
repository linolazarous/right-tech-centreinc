import React, { useEffect, useState } from 'react';
  import { generateResume } from '../services/resumeBuilderService';

  const ResumeBuilder = ({ userId }) => {
      const [resume, setResume] = useState(null);

      useEffect(() => {
          fetchResume();
      }, [userId]);

      const fetchResume = async () => {
          const data = await generateResume(userId);
          setResume(data);
      };

      return (
          <div>
              <h1>Resume Builder</h1>
              {resume && (
                  <div>
                      <h2>{resume.name}</h2>
                      <p>Skills: {resume.skills.join(', ')}</p>
                      <p>Courses: {resume.courses.join(', ')}</p>
                  </div>
              )}
          </div>
      );
  };

  export default ResumeBuilder;