import React from 'react';

const ProfileSection = ({ user, onEdit }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Profile Information</h3>
        <button
          onClick={onEdit}
          className="bg-indigo-600 text-white px-4 py-2 rounded text-sm hover:bg-indigo-700"
        >
          Edit Profile
        </button>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-20 h-20 rounded-full"
          />
          <div>
            <h4 className="text-xl font-semibold">{user.name}</h4>
            <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
            <p className="text-sm text-gray-500">{user.role}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Phone:</span>
            <span className="ml-2">{user.phone || 'Not provided'}</span>
          </div>
          <div>
            <span className="text-gray-500">Location:</span>
            <span className="ml-2">{user.location || 'Not provided'}</span>
          </div>
          <div>
            <span className="text-gray-500">Joined:</span>
            <span className="ml-2">{new Date(user.joinDate).toLocaleDateString()}</span>
          </div>
          <div>
            <span className="text-gray-500">Last Active:</span>
            <span className="ml-2">{new Date(user.lastActive).toLocaleDateString()}</span>
          </div>
        </div>

        {user.bio && (
          <div>
            <h5 className="font-medium mb-2">Bio</h5>
            <p className="text-gray-700 dark:text-gray-300">{user.bio}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileSection;
