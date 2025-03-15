import React, { useEffect, useState } from 'react';
import { fetchUserProfile } from '../services/api';

const Profile = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userId = localStorage.getItem('userId'); // Assuming userId is stored in localStorage
        fetchUserProfile(userId).then((data) => setUser(data));
    }, []);

    if (!user) return <div>Loading...</div>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">Profile</h1>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold">{user.name}</h2>
                <p className="text-gray-600">{user.email}</p>
                <div className="mt-4">
                    <h3 className="text-xl font-bold">Enrolled Courses</h3>
                    <ul className="mt-2">
                        {user.coursesEnrolled.map((course) => (
                            <li key={course.id} className="text-gray-700">{course.title}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Profile;