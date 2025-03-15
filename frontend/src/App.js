import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Courses from './pages/Courses';
import Profile from './pages/Profile';
import LiveClass from './pages/LiveClass';
import Forum from './pages/Forum';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

function App() {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/courses" element={<Courses />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/live-class" element={<LiveClass />} />
                <Route path="/forum" element={<Forum />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms-of-service" element={<TermsOfService />} />
            </Routes>
            <Footer />
        </Router>
    );
}

export default App;