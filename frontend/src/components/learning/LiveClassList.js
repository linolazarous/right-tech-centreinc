import React from 'react';

const LiveClassList = ({ classes }) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {classes.map((classItem) => (
        <div key={classItem.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-semibold">{classItem.title}</h3>
            <span className={`px-2 py-1 rounded text-xs ${
              classItem.status === 'live' ? 'bg-red-100 text-red-800' :
              classItem.status === 'upcoming' ? 'bg-yellow-100 text-yellow-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {classItem.status}
            </span>
          </div>

          <p className="text-gray-600 dark:text-gray-400 mb-4">{classItem.description}</p>

          <div className="space-y-2 mb-4 text-sm">
            <div className="flex justify-between">
              <span>Instructor:</span>
              <span className="font-medium">{classItem.instructor}</span>
            </div>
            <div className="flex justify-between">
              <span>Date & Time:</span>
              <span>{new Date(classItem.datetime).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Duration:</span>
              <span>{classItem.duration}</span>
            </div>
            <div className="flex justify-between">
              <span>Participants:</span>
              <span>{classItem.participants}/{classItem.maxParticipants}</span>
            </div>
          </div>

          <button
            className={`w-full py-2 px-4 rounded ${
              classItem.status === 'live' ? 'bg-red-600 hover:bg-red-700' :
              classItem.status === 'upcoming' ? 'bg-yellow-600 hover:bg-yellow-700' :
              'bg-gray-600 hover:bg-gray-700'
            } text-white`}
            disabled={classItem.status === 'completed' || classItem.participants >= classItem.maxParticipants}
          >
            {classItem.status === 'live' ? 'Join Now' :
             classItem.status === 'upcoming' ? 'Register' :
             'Completed'}
          </button>
        </div>
      ))}
    </div>
  );
};

export default LiveClassList;
