import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav className="bg-blue-600 p-4 text-white">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold">
                    Right Tech Centre
                </Link>
                <div className="flex space-x-4">
                    <Link to="/courses" className="hover:text-gray-300">Courses</Link>
                    <Link to="/profile" className="hover:text-gray-300">Profile</Link>
                    <Link to="/forum" className="hover:text-gray-300">Forum</Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;