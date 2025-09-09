import React from 'react';

const IntegrationCard = ({ integration, onConnect, onDisconnect }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex items-center space-x-4 mb-4">
        <img
          src={integration.logo}
          alt={integration.name}
          className="w-12 h-12 rounded-full"
        />
        <div>
          <h3 className="text-lg font-semibold">{integration.name}</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">{integration.category}</p>
        </div>
      </div>

      <p className="text-gray-700 dark:text-gray-300 mb-4">{integration.description}</p>

      <div className="flex items-center justify-between mb-4">
        <span className={`px-2 py-1 rounded text-xs ${
          integration.connected ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {integration.connected ? 'Connected' : 'Not Connected'}
        </span>
        <span className="text-sm text-gray-500">{integration.users}+ users</span>
      </div>

      {integration.connected ? (
        <button
          onClick={() => onDisconnect(integration.id)}
          className="w-full bg-red-600 text-white py-2 px-4 rounded hover
