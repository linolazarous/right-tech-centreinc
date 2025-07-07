import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getDownloadableCourses, downloadCourse } from '../services/offlineService';
import { FaDownload, FaCheckCircle, FaWifi } from 'react-icons/fa';

const OfflineLearning = ({ userId }) => {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [downloading, setDownloading] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setIsLoading(true);
        setError('');
        const data = await getDownloadableCourses(userId);
        setCourses(data);
      } catch (err) {
        console.error('Offline learning error:', err);
        setError('Failed to load downloadable courses');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, [userId]);

  const handleDownload = async (courseId) => {
    setDownloading(courseId);
    try {
      await downloadCourse(userId, courseId);
      setCourses(prev => prev.map(course => 
        course.id === courseId ? { ...course, downloaded: true } : course
      ));
    } catch (err) {
      console.error('Download failed:', err);
      setError(`Failed to download course`);
    } finally {
      setDownloading(null);
    }
  };

  return (
    <div className="offline-learning">
      <h1 className="offline-header">
        <FaWifi /> Offline Learning
      </h1>
      <p className="offline-subtitle">
        Download courses for offline access when you don't have internet connection
      </p>

      {isLoading ? (
        <div className="loading">Loading available courses...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : courses.length === 0 ? (
        <div className="no-courses">
          No courses available for offline download
        </div>
      ) : (
        <div className="course-download-list">
          {courses.map(course => (
            <div key={course.id} className="download-item">
              <div className="course-info">
                <h3>{course.title}</h3>
                <p>{course.description}</p>
                <div className="course-meta">
                  <span>Size: {course.size}</span>
                  <span>Last updated: {new Date(course.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="download-action">
                {course.downloaded ? (
                  <span className="downloaded">
                    <FaCheckCircle /> Downloaded
                  </span>
                ) : (
                  <button
                    onClick={() => handleDownload(course.id)}
                    disabled={downloading === course.id}
                    className="download-button"
                  >
                    {downloading === course.id ? (
                      'Downloading...'
                    ) : (
                      <>
                        <FaDownload /> Download
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="offline-notes">
        <h3>Notes:</h3>
        <ul>
          <li>Downloaded courses are available for 30 days</li>
          <li>You can download up to 5 courses at a time</li>
          <li>Connect to WiFi for large downloads</li>
        </ul>
      </div>
    </div>
  );
};

OfflineLearning.propTypes = {
  userId: PropTypes.string.isRequired
};

export default OfflineLearning;
