import React from 'react';

const Leaderboard = ({ users }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">Leaderboard</h3>
      
      <div className="space-y-3">
        {users.map((user, index) => (
          <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded">
            <div className="flex items-center space-x-3">
              <span className="text-sm font-medium text-gray-500 w-6 text-center">
                #{index + 1}
              </span>
              <img
                src={user.avatar}
                alt={user.name}
                className="w-8 h-8 rounded-full"
              />
              <span className="font-medium">{user.name}</span>
            </div>
            <span className="font-bold text-indigo-600">{user.points} pts</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;
