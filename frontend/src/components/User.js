import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getUserProfile, updateUserProfile } from '../services/userService';
import { FaUser, FaEdit, FaSave, FaCamera } from 'react-icons/fa';

const User = ({ userId }) => {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [avatarPreview, setAvatarPreview] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        setError('');
        const data = await getUserProfile(userId);
        setProfile(data);
      } catch (err) {
        console.error('Profile error:', err);
        setError('Failed to load user profile');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
      setProfile(prev => ({
        ...prev,
        avatarFile: file
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await updateUserProfile(userId, profile);
      setIsEditing(false);
      // Refresh profile after update
      const updated = await getUserProfile(userId);
      setProfile(updated);
      setAvatarPreview('');
    } catch (err) {
      console.error('Update error:', err);
      setError('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <div className="loading">Loading user profile...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!profile) return <div className="no-profile">No profile data available</div>;

  return (
    <div className="user-profile-container">
      <h1 className="profile-header">
        <FaUser /> User Profile
      </h1>

      <div className="profile-content">
        <div className="profile-sidebar">
          <div className="avatar-container">
            {isEditing ? (
              <>
                <img
                  src={avatarPreview || profile.avatar}
                  alt="Profile preview"
                  className="avatar"
                />
                <label className="avatar-upload">
                  <FaCamera /> Change Photo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </label>
              </>
            ) : (
              <img
                src={profile.avatar}
                alt={profile.name}
                className="avatar"
              />
            )}
          </div>

          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="edit-button"
            >
              <FaEdit /> Edit Profile
            </button>
          )}
        </div>

        <div className="profile-details">
          {isEditing ? (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Bio</label>
                <textarea
                  name="bio"
                  value={profile.bio}
                  onChange={handleChange}
                  rows="4"
                />
              </div>

              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  name="location"
                  value={profile.location}
                  onChange={handleChange}
                />
              </div>

              <div className="form-buttons">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="save-button"
                >
                  {isLoading ? (
                    <>
                      <FaSpinner className="spinner" /> Saving...
                    </>
                  ) : (
                    <>
                      <FaSave /> Save Changes
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="cancel-button"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <>
              <h2>{profile.name}</h2>
              <p className="profile-email">{profile.email}</p>
              {profile.location && (
                <p className="profile-location">{profile.location}</p>
              )}
              {profile.bio && (
                <div className="profile-bio">
                  <h3>About Me</h3>
                  <p>{profile.bio}</p>
                </div>
              )}
              <div className="profile-stats">
                <div className="stat-item">
                  <span className="stat-value">{profile.coursesCompleted}</span>
                  <span className="stat-label">Courses Completed</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">{profile.badgesEarned}</span>
                  <span className="stat-label">Badges Earned</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">{profile.streakDays}</span>
                  <span className="stat-label">Day Streak</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

User.propTypes = {
  userId: PropTypes.string.isRequired
};

export default User;
