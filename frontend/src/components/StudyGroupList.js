import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getStudyGroups, createStudyGroup } from '../services/socialService';
import StudyGroupCard from './StudyGroupCard';
import { FaUsers, FaSearch, FaPlus } from 'react-icons/fa';

const StudyGroupList = ({ userId }) => {
  const [groups, setGroups] = useState([]);
  const [filteredGroups, setFilteredGroups] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newGroup, setNewGroup] = useState({
    name: '',
    description: '',
    subject: '',
    maxMembers: 10,
    isPublic: true
  });

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        setIsLoading(true);
        setError('');
        const data = await getStudyGroups(userId);
        setGroups(data);
        setFilteredGroups(data);
      } catch (err) {
        console.error('Study group error:', err);
        setError('Failed to load study groups');
      } finally {
        setIsLoading(false);
      }
    };

    fetchGroups();
  }, [userId]);

  useEffect(() => {
    const filtered = groups.filter(group =>
      group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredGroups(filtered);
  }, [searchTerm, groups]);

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    if (!newGroup.name || !newGroup.subject) {
      setError('Group name and subject are required');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      const createdGroup = await createStudyGroup(userId, newGroup);
      setGroups(prev => [...prev, createdGroup]);
      setNewGroup({
        name: '',
        description: '',
        subject: '',
        maxMembers: 10,
        isPublic: true
      });
      setShowCreateForm(false);
    } catch (err) {
      console.error('Create group error:', err);
      setError('Failed to create study group');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewGroup(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  if (isLoading) return <div className="loading">Loading study groups...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="study-group-container">
      <div className="study-group-header">
        <h1>
          <FaUsers /> Study Groups
        </h1>
        <p className="subheader">
          Collaborate with peers to enhance your learning experience
        </p>
      </div>

      <div className="group-controls">
        <div className="search-bar">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search groups..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="create-button"
        >
          <FaPlus /> Create New Group
        </button>
      </div>

      {showCreateForm && (
        <div className="create-group-form">
          <h3>Create New Study Group</h3>
          <form onSubmit={handleCreateGroup}>
            <div className="form-group">
              <label>Group Name</label>
              <input
                type="text"
                name="name"
                value={newGroup.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Subject/Topic</label>
              <input
                type="text"
                name="subject"
                value={newGroup.subject}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={newGroup.description}
                onChange={handleChange}
                rows="3"
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Max Members</label>
                <input
                  type="number"
                  name="maxMembers"
                  min="2"
                  max="50"
                  value={newGroup.maxMembers}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group checkbox">
                <input
                  type="checkbox"
                  id="isPublic"
                  name="isPublic"
                  checked={newGroup.isPublic}
                  onChange={handleChange}
                />
                <label htmlFor="isPublic">Public Group</label>
              </div>
            </div>
            <div className="form-buttons">
              <button
                type="submit"
                disabled={isLoading}
                className="submit-button"
              >
                {isLoading ? 'Creating...' : 'Create Group'}
              </button>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="cancel-button"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {filteredGroups.length === 0 ? (
        <div className="no-groups">
          {searchTerm ? (
            <p>No groups match your search criteria</p>
          ) : (
            <>
              <p>No study groups available yet</p>
              <button onClick={() => setShowCreateForm(true)}>
                Be the first to create one!
              </button>
            </>
          )}
        </div>
      ) : (
        <div className="group-list">
          {filteredGroups.map(group => (
            <StudyGroupCard
              key={group._id}
              group={group}
              userId={userId}
            />
          ))}
        </div>
      )}
    </div>
  );
};

StudyGroupList.propTypes = {
  userId: PropTypes.string.isRequired
};

export default StudyGroupList;
