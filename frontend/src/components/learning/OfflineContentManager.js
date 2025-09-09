import React, { useState } from 'react';

const OfflineContentManager = () => {
  const [downloadedContent, setDownloadedContent] = useState([]);
  const [storageUsage, setStorageUsage] = useState(0);

  const availableContent = [
    { id: 1, title: 'Introduction to Python', size: '250 MB', duration: '2h 30m' },
    { id: 2, title: 'Web Development Basics', size: '180 MB', duration: '1h 45m' },
    { id: 3, title: 'Data Structures & Algorithms', size: '320 MB', duration: '3h 15m' }
  ];

  const handleDownload = (content) => {
    setDownloadedContent([...downloadedContent, content]);
    setStorageUsage(prev => prev + parseInt(content.size));
  };

  const handleDelete = (contentId) => {
    const content = downloadedContent.find(c => c.id === contentId);
    setDownloadedContent(downloadedContent.filter(c => c.id !== contentId));
    setStorageUsage(prev => prev - parseInt(content.size));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Storage Usage</h3>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
          <div
            className="bg-indigo-600 h-4 rounded-full transition-all"
            style={{ width: `${(storageUsage / 1000) * 100}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
          {storageUsage} MB used of 1000 MB
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <h4 className="font-semibold mb-4">Available for Download</h4>
          <div className="space-y-3">
            {availableContent.map((content) => (
              <div key={content.id} className="bg-gray-50 dark:bg-gray-700 rounded p-4">
                <h5 className="font-medium">{content.title}</h5>
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mt-2">
                  <span>{content.size}</span>
                  <span>{content.duration}</span>
                </div>
                <button
                  onClick={() => handleDownload(content)}
                  className="w-full bg-indigo-600 text-white py-1 px-3 rounded text-sm mt-2 hover:bg-indigo-700"
                >
                  Download
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-4">Downloaded Content</h4>
          {downloadedContent.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No content downloaded yet</p>
          ) : (
            <div className="space-y-3">
              {downloadedContent.map((content) => (
                <div key={content.id} className="bg-gray-50 dark:bg-gray-700 rounded p-4">
                  <h5 className="font-medium">{content.title}</h5>
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mt-2">
                    <span>{content.size}</span>
                    <span>{content.duration}</span>
                  </div>
                  <button
                    onClick={() => handleDelete(content.id)}
                    className="w-full bg-red-600 text-white py-1 px-3 rounded text-sm mt-2 hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OfflineContentManager;
