import React from 'react';
import { Link } from 'react-router-dom';
import { FaLinkedin, FaTwitter, FaGithub, FaEnvelope } from 'react-icons/fa';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-800 text-white py-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="footer-section">
                        <h3 className="text-lg font-semibold mb-4">Right Tech Centre</h3>
                        <p className="text-gray-400">
                            Empowering your career through technology education and professional development.
                        </p>
                    </div>
                    
                    <div className="footer-section">
                        <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
                        <ul className="space-y-2">
                            <li><Link to="/courses" className="text-gray-400 hover:text-white">Courses</Link></li>
                            <li><Link to="/about" className="text-gray-400 hover:text-white">About Us</Link></li>
                            <li><Link to="/careers" className="text-gray-400 hover:text-white">Careers</Link></li>
                            <li><Link to="/blog" className="text-gray-400 hover:text-white">Blog</Link></li>
                        </ul>
                    </div>
                    
                    <div className="footer-section">
                        <h4 className="text-lg font-semibold mb-4">Legal</h4>
                        <ul className="space-y-2">
                            <li><Link to="/privacy-policy" className="text-gray-400 hover:text-white">Privacy Policy</Link></li>
                            <li><Link to="/terms-of-service" className="text-gray-400 hover:text-white">Terms of Service</Link></li>
                            <li><Link to="/cookie-policy" className="text-gray-400 hover:text-white">Cookie Policy</Link></li>
                        </ul>
                    </div>
                    
                    <div className="footer-section">
                        <h4 className="text-lg font-semibold mb-4">Connect With Us</h4>
                        <div className="flex space-x-4 mb-4">
                            <a href="https://linkedin.com/company" aria-label="LinkedIn" className="text-gray-400 hover:text-white">
                                <FaLinkedin size={20} />
                            </a>
                            <a href="https://twitter.com" aria-label="Twitter" className="text-gray-400 hover:text-white">
                                <FaTwitter size={20} />
                            </a>
                            <a href="https://github.com" aria-label="GitHub" className="text-gray-400 hover:text-white">
                                <FaGithub size={20} />
                            </a>
                            <a href="mailto:contact@righttechcentre.com" aria-label="Email" className="text-gray-400 hover:text-white">
                                <FaEnvelope size={20} />
                            </a>
                        </div>
                        <p className="text-gray-400">contact@righttechcentre.com</p>
                    </div>
                </div>
                
                <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
                    <p>&copy; {currentYear} Right Tech Centre. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
