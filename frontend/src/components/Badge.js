import React from 'react';

const Badge = ({ name, description }) => {
    return (
        <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-bold">{name}</h2>
            <p className="text-gray-600">{description}</p>
        </div>
    );
};

export default Badge;