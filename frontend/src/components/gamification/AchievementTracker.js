import React from 'react';

const AchievementTracker = ({ achievements }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">Your Achievements</h3>
      
      <div className="grid gap-4 md:grid-cols-2">
        {achievements.map((achievement) => (
          <div
            key={achievement.id}
            className={`p-4 rounded-lg border-2 ${
              achievement.earned
                ? 'border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20'
                : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-full ${
                achievement.earned ? 'bg-yellow-400' : 'bg-gray-300 dark:bg-gray-600'
              }`}>
                <span className="text-white">🏆</span>
              </div>
              <div>
                <h4 className="font-medium">{achievement.name}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {achievement.description}
                </p>
                {!achievement.earned && (
                  <p className="text-xs text-gray-500 mt-1">
                    {achievement.progress}% complete
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AchievementTracker;
