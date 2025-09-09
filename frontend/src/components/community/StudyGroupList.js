import React from 'react';

const StudyGroupList = ({ groups }) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {groups.map((group) => (
        <div key={group.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-2">{group.name}</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{group.description}</p>
          
          <div className="space-y-2 mb-4">
            <div className="flex justify-between">
              <span>Members:</span>
              <span>{group.memberCount}/{group.maxMembers}</span>
            </div>
            <div className="flex justify-between">
              <span>Course:</span>
              <span>{group.course}</span>
            </div>
            <div className="flex justify-between">
              <span>Schedule:</span>
              <span>{group.schedule}</span>
            </div>
          </div>

          <button className="w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 disabled:bg-gray-400">
            {group.memberCount >= group.maxMembers ? 'Group Full' : 'Join Group'}
          </button>
        </div>
      ))}
    </div>
  );
};

export default StudyGroupList;
