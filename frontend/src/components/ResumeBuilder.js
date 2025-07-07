import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { generateResume, saveResume, getResumeTemplates } from '../services/resumeBuilderService';
import { FaFileDownload, FaEdit, FaSave, FaFileAlt } from 'react-icons/fa';

const ResumeBuilder = ({ userId }) => {
  const [resume, setResume] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [activeTemplate, setActiveTemplate] = useState('professional');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError('');
        const [resumeData, templateData] = await Promise.all([
          generateResume(userId),
          getResumeTemplates()
        ]);
        setResume(resumeData);
        setTemplates(templateData);
      } catch (err) {
        console.error('Resume builder error:', err);
        setError('Failed to load resume data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const handleChange = (e, section, index) => {
    const { name, value } = e.target;
    setResume(prev => {
      const updated = { ...prev };
      if (section && index !== undefined) {
        updated[section][index][name] = value;
      } else {
        updated[name] = value;
      }
      return updated;
    });
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      await saveResume(userId, resume);
      setIsEditing(false);
    } catch (err) {
      console.error('Save resume error:', err);
      setError('Failed to save resume');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTemplateChange = async (template) => {
    try {
      setIsLoading(true);
      setActiveTemplate(template);
      const data = await generateResume(userId, template);
      setResume(data);
    } catch (err) {
      console.error('Template change error:', err);
      setError('Failed to apply template');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <div className="loading">Building your resume...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!resume) return <div className="no-resume">No resume data available</div>;

  return (
    <div className="resume-builder">
      <div className="resume-header">
        <h1>
          <FaFileAlt /> Resume Builder
        </h1>
        <div className="resume-actions">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="save-button"
              >
                {isLoading ? (
                  <>
                    <FaSpinner className="spinner" /> Saving...
                  </>
                ) : (
                  <>
                    <FaSave /> Save Resume
                  </>
                )}
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="cancel-button"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="edit-button"
              >
                <FaEdit /> Edit Resume
              </button>
              <button className="download-button">
                <FaFileDownload /> Download PDF
              </button>
            </>
          )}
        </div>
      </div>

      <div className="template-selector">
        <label>Template:</label>
        <div className="template-options">
          {templates.map(template => (
            <button
              key={template.id}
              className={`template-option ${activeTemplate === template.id ? 'active' : ''}`}
              onClick={() => handleTemplateChange(template.id)}
            >
              {template.name}
            </button>
          ))}
        </div>
      </div>

      <div className="resume-preview-container">
        <div className={`resume-preview ${activeTemplate}`}>
          {/* Header Section */}
          <div className="resume-header-section">
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={resume.name}
                onChange={handleChange}
                className="resume-name-edit"
              />
            ) : (
              <h2 className="resume-name">{resume.name}</h2>
            )}
            <div className="contact-info">
              {isEditing ? (
                <>
                  <input
                    type="text"
                    name="email"
                    value={resume.email}
                    onChange={handleChange}
                    placeholder="Email"
                  />
                  <input
                    type="text"
                    name="phone"
                    value={resume.phone}
                    onChange={handleChange}
                    placeholder="Phone"
                  />
                  <input
                    type="text"
                    name="location"
                    value={resume.location}
                    onChange={handleChange}
                    placeholder="Location"
                  />
                </>
              ) : (
                <>
                  <span>{resume.email}</span>
                  <span>{resume.phone}</span>
                  <span>{resume.location}</span>
                </>
              )}
            </div>
          </div>

          {/* Skills Section */}
          <div className="resume-section">
            <h3>Skills</h3>
            {isEditing ? (
              <textarea
                name="skills"
                value={resume.skills.join(', ')}
                onChange={(e) => {
                  const skills = e.target.value.split(',').map(s => s.trim());
                  setResume(prev => ({ ...prev, skills }));
                }}
              />
            ) : (
              <ul className="skills-list">
                {resume.skills.map((skill, index) => (
                  <li key={index}>{skill}</li>
                ))}
              </ul>
            )}
          </div>

          {/* Experience Section */}
          <div className="resume-section">
            <h3>Experience</h3>
            {resume.experience.map((exp, index) => (
              <div key={index} className="experience-item">
                {isEditing ? (
                  <>
                    <input
                      type="text"
                      name="title"
                      value={exp.title}
                      onChange={(e) => handleChange(e, 'experience', index)}
                      placeholder="Job Title"
                    />
                    <input
                      type="text"
                      name="company"
                      value={exp.company}
                      onChange={(e) => handleChange(e, 'experience', index)}
                      placeholder="Company"
                    />
                    <div className="date-inputs">
                      <input
                        type="text"
                        name="startDate"
                        value={exp.startDate}
                        onChange={(e) => handleChange(e, 'experience', index)}
                        placeholder="Start Date"
                      />
                      <span>to</span>
                      <input
                        type="text"
                        name="endDate"
                        value={exp.endDate}
                        onChange={(e) => handleChange(e, 'experience', index)}
                        placeholder="End Date"
                      />
                    </div>
                    <textarea
                      name="description"
                      value={exp.description}
                      onChange={(e) => handleChange(e, 'experience', index)}
                      placeholder="Description"
                    />
                  </>
                ) : (
                  <>
                    <h4>{exp.title} at {exp.company}</h4>
                    <p className="experience-dates">
                      {exp.startDate} - {exp.endDate}
                    </p>
                    <p className="experience-description">{exp.description}</p>
                  </>
                )}
              </div>
            ))}
          </div>

          {/* Education Section */}
          <div className="resume-section">
            <h3>Education</h3>
            {resume.education.map((edu, index) => (
              <div key={index} className="education-item">
                {isEditing ? (
                  <>
                    <input
                      type="text"
                      name="degree"
                      value={edu.degree}
                      onChange={(e) => handleChange(e, 'education', index)}
                      placeholder="Degree"
                    />
                    <input
                      type="text"
                      name="institution"
                      value={edu.institution}
                      onChange={(e) => handleChange(e, 'education', index)}
                      placeholder="Institution"
                    />
                    <input
                      type="text"
                      name="year"
                      value={edu.year}
                      onChange={(e) => handleChange(e, 'education', index)}
                      placeholder="Year"
                    />
                  </>
                ) : (
                  <>
                    <h4>{edu.degree}</h4>
                    <p>{edu.institution}, {edu.year}</p>
                  </>
                )}
              </div>
            ))}
          </div>

          {/* Courses Section */}
          <div className="resume-section">
            <h3>Relevant Courses</h3>
            {isEditing ? (
              <textarea
                name="courses"
                value={resume.courses.join(', ')}
                onChange={(e) => {
                  const courses = e.target.value.split(',').map(c => c.trim());
                  setResume(prev => ({ ...prev, courses }));
                }}
              />
            ) : (
              <ul className="courses-list">
                {resume.courses.map((course, index) => (
                  <li key={index}>{course}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      <div className="resume-tips">
        <h3>Resume Tips</h3>
        <ul>
          <li>Keep your resume to 1-2 pages maximum</li>
          <li>Use action verbs to describe your experience</li>
          <li>Tailor your resume for each job application</li>
          <li>Highlight measurable achievements</li>
        </ul>
      </div>
    </div>
  );
};

ResumeBuilder.propTypes = {
  userId: PropTypes.string.isRequired
};

export default ResumeBuilder;
