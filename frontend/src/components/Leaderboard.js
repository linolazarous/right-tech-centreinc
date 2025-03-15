import React from 'react';

const Leaderboard = ({ leaderboard }) => {
    return (
        <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Leaderboard</h2>
            <ul>
                {leaderboard.map((entry, index) => (
                    <li key={index} className="flex justify-between mb-2">
                        <span>{entry.name}</span>
                        <span>{entry.score}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Leaderboard;