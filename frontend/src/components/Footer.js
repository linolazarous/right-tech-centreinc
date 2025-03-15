import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-gray-800 text-white p-4 mt-8">
            <div className="container mx-auto text-center">
                <p>&copy; 2024 Right Tech Centre. All rights reserved.</p>
                <div className="mt-2">
                    <Link to="/privacy-policy" className="mr-4 hover:text-gray-400">Privacy Policy</Link>
                    <Link to="/terms-of-service" className="hover:text-gray-400">Terms of Service</Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;