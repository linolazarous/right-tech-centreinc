import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getNotificationSettings, updateNotificationSettings } from '../services/notificationService';
import { FaBell, FaBellSlash, FaSave } from 'react-icons/fa';

const PushNotification = ({ userId }) => {
  const [settings, setSettings] = useState({
    enabled: true,
    courseUpdates: true,
    messages: true,
    announcements: true,
    reminders: false,
    sound: true,
    vibration: false
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState({ success: false, message: '' });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setIsLoading(true);
        const data = await getNotificationSettings(userId);
        setSettings(data);
      } catch (err) {
        console.error('Notification settings error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, [userId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const toggleAll = (enable) => {
    setSettings(prev => ({
      ...prev,
      enabled: enable,
      courseUpdates: enable,
      messages: enable,
      announcements: enable,
      reminders: enable
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveStatus({ success: false, message: '' });
    try {
      await updateNotificationSettings(userId, settings);
      setSaveStatus({ success: true, message: 'Notification settings saved successfully' });
    } catch (err) {
      console.error('Save settings error:', err);
      setSaveStatus({ success: false, message: 'Failed to save notification settings' });
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveStatus({ success: false, message: '' }), 3000);
    }
  };

  if (isLoading) return <div className="loading">Loading notification settings...</div>;

  return (
    <div className="notification-settings">
      <h1 className="notification-header">
        <FaBell /> Notification Settings
      </h1>

      {saveStatus.message && (
        <div className={`save-status ${saveStatus.success ? 'success' : 'error'}`}>
          {saveStatus.message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="notification-section">
          <div className="notification-toggle">
            <label>
              <input
                type="checkbox"
                name="enabled"
                checked={settings.enabled}
                onChange={(e) => {
                  handleChange(e);
                  toggleAll(e.target.checked);
                }}
              />
              Enable Push Notifications
            </label>
            <p className="section-description">
              {settings.enabled ? (
                <><FaBell /> Notifications are enabled</>
              ) : (
                <><FaBellSlash /> Notifications are disabled</>
              )}
            </p>
          </div>
        </div>

        <div className="notification-section">
          <h2>Notification Types</h2>
          <div className="notification-options">
            <div className="notification-option">
              <label>
                <input
                  type="checkbox"
                  name="courseUpdates"
                  checked={settings.courseUpdates}
                  onChange={handleChange}
                  disabled={!settings.enabled}
                />
                Course Updates
              </label>
              <p>New content, deadlines, and course announcements</p>
            </div>

            <div className="notification-option">
              <label>
                <input
                  type="checkbox"
                  name="messages"
                  checked={settings.messages}
                  onChange={handleChange}
                  disabled={!settings.enabled}
                />
                Messages
              </label>
              <p>Direct messages from instructors and peers</p>
            </div>

            <div className="notification-option">
              <label>
                <input
                  type="checkbox"
                  name="announcements"
                  checked={settings.announcements}
                  onChange={handleChange}
                  disabled={!settings.enabled}
                />
                System Announcements
              </label>
              <p>Platform updates and important notices</p>
            </div>

            <div className="notification-option">
              <label>
                <input
                  type="checkbox"
                  name="reminders"
                  checked={settings.reminders}
                  onChange={handleChange}
                  disabled={!settings.enabled}
                />
                Reminders
              </label>
              <p>Upcoming deadlines and scheduled sessions</p>
            </div>
          </div>
        </div>

        <div className="notification-section">
          <h2>Notification Preferences</h2>
          <div className="preference-options">
            <div className="preference-option">
              <label>
                <input
                  type="checkbox"
                  name="sound"
                  checked={settings.sound}
                  onChange={handleChange}
                  disabled={!settings.enabled}
                />
                Play Sound
              </label>
            </div>

            <div className="preference-option">
              <label>
                <input
                  type="checkbox"
                  name="vibration"
                  checked={settings.vibration}
                  onChange={handleChange}
                  disabled={!settings.enabled}
                />
                Vibrate
              </label>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="save-button"
        >
          {isSaving ? (
            <>
              <FaSpinner className="spinner" /> Saving...
            </>
          ) : (
            <>
              <FaSave /> Save Settings
            </>
          )}
        </button>
      </form>
    </div>
  );
};

PushNotification.propTypes = {
  userId: PropTypes.string.isRequired
};

export default PushNotification;
