import React from 'react';

const LiveClass = () => {
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">Live Classes</h1>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <p className="text-gray-600">Join live classes and interact with instructors in real-time.</p>
                <div className="mt-4">
                    <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                        Join Now
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LiveClass;