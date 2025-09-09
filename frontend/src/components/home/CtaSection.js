
import React from 'react';
import { Link } from 'react-router-dom';

const CtaSection = () => {
  return (
    <section className="relative bg-gradient-to-r from-indigo-900 to-purple-900 overflow-hidden">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:py-24 lg:px-8">
        <div className="relative z-10 lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
          {/* Left Content */}
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              <span className="block">Ready to transform your future?</span>
              <span className="block text-indigo-200 mt-2">Take the first step toward tech mastery today.</span>
            </h2>
            <p className="mt-4 text-lg text-indigo-100 max-w-2xl">
              Join thousands of students who've accelerated their careers with our industry-leading programs.
            </p>
          </div>

          {/* Right Content - CTA Buttons */}
          <div className="mt-12 lg:mt-0">
            <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-sm rounded-xl p-8 border border-white border-opacity-20">
              <h3 className="text-xl font-bold text-white">Start your journey</h3>
              <div className="mt-6 grid grid-cols-1 gap-4">
                <Link 
                  to="/courses" 
                  className="flex items-center justify-center px-6 py-4 border border-transparent text-lg font-medium rounded-lg shadow-sm text-indigo-900 bg-white hover:bg-indigo-50 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
                >
                  <i className="fas fa-search mr-3" aria-hidden="true"></i> Explore Programs
                </Link>
                <Link 
                  to="/register" 
                  className="flex items-center justify-center px-6 py-4 border border-transparent text-lg font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
                >
                  <i className="fas fa-user-graduate mr-3" aria-hidden="true"></i> Apply Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
