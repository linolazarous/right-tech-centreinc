import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { monitorExam, startProctoringSession } from '../services/proctoringService';
import { FaUserCircle, FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa';

const ProctoringMonitor = ({ examId, userId }) => {
  const [proctoringData, setProctoringData] = useState(null);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [error, setError] = useState('');
  const videoRef = useRef(null);
  const [warnings, setWarnings] = useState(0);

  useEffect(() => {
    let intervalId;
    const startMonitoring = async () => {
      try {
        // Start video stream
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        // Start proctoring session
        await startProctoringSession(examId, userId);
        setIsMonitoring(true);

        // Check proctoring status periodically
        intervalId = setInterval(async () => {
          const data = await monitorExam(examId, userId);
          setProctoringData(data);
          if (data.suspiciousActivity) {
            setWarnings(prev => prev + 1);
          }
        }, 5000);
      } catch (err) {
        console.error('Proctoring error:', err);
        setError('Failed to start proctoring session');
      }
    };

    startMonitoring();

    return () => {
      clearInterval(intervalId);
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, [examId, userId]);

  return (
    <div className="proctoring-monitor">
      <h1 className="proctoring-header">Exam Proctoring</h1>
      <p className="proctoring-subheader">Your exam session is being monitored for integrity</p>

      {error ? (
        <div className="proctoring-error">{error}</div>
      ) : (
        <div className="proctoring-content">
          <div className="video-feed">
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="camera-feed"
            />
            <div className="proctoring-status">
              <h3>
                Status: {isMonitoring ? (
                  <span className="active">Active Monitoring</span>
                ) : (
                  <span className="inactive">Not Monitoring</span>
                )}
              </h3>
              {warnings > 0 && (
                <div className="warning-count">
                  <FaExclamationTriangle /> Warnings: {warnings}
                </div>
              )}
            </div>
          </div>

          {proctoringData && (
            <div className="proctoring-results">
              <h3>Proctoring Analysis</h3>
              <div className="result-item">
                <span>Face Detection:</span>
                <span className={proctoringData.faceDetected ? 'success' : 'error'}>
                  {proctoringData.faceDetected ? (
                    <>
                      <FaCheckCircle /> Detected
                    </>
                  ) : (
                    <>
                      <FaExclamationTriangle /> Not Detected
                    </>
                  )}
                </span>
              </div>
              <div className="result-item">
                <span>Suspicious Activity:</span>
                <span className={proctoringData.suspiciousActivity ? 'error' : 'success'}>
                  {proctoringData.suspiciousActivity ? 'Detected' : 'None'}
                </span>
              </div>
              <div className="result-item">
                <span>Multiple Faces:</span>
                <span>{proctoringData.multipleFaces ? 'Detected' : 'None'}</span>
              </div>
              <div className="result-item">
                <span>Focus Level:</span>
                <span>{proctoringData.focusLevel}%</span>
              </div>
              <div className="result-item">
                <span>Behavior Analysis:</span>
                <span>{proctoringData.behaviorAnalysis}</span>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="proctoring-footer">
        <p>
          <FaUserCircle /> Your image and session data will be stored securely and deleted after grading
        </p>
      </div>
    </div>
  );
};

ProctoringMonitor.propTypes = {
  examId: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired
};

export default ProctoringMonitor;
