import React from 'react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <section id="home" className="relative text-white pt-24 pb-20 md:pt-32 md:pb-28 overflow-hidden">
      {/* Background image and overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-900 to-purple-900 opacity-90"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Left Content */}
          <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
            <h1 className="text-4xl tracking-tight font-extrabold sm:text-5xl md:text-6xl">
              <span className="block">Future-Ready</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-purple-300">Tech Education</span>
            </h1>
            
            <p className="mt-3 text-base text-blue-100 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
              Master in-demand skills with our self-paced programs in AI, Web3, Cybersecurity, and more. 
              Earn diplomas, degrees, or industry certifications with flexible 4-credit modules.
            </p>
            
            {/* Tech Badges */}
            <div className="mt-6 flex flex-wrap gap-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-800 bg-opacity-60 text-indigo-100">
                <i className="fas fa-robot mr-1" aria-hidden="true"></i> AI & ML
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-pink-800 bg-opacity-60 text-pink-100">
                <i className="fas fa-link mr-1" aria-hidden="true"></i> Blockchain
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-800 bg-opacity-60 text-purple-100">
                <i className="fas fa-shield-alt mr-1" aria-hidden="true"></i> Cybersecurity
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-800 bg-opacity-60 text-blue-100">
                <i className="fas fa-cloud mr-1" aria-hidden="true"></i> Cloud Computing
              </span>
            </div>
            
            {/* Pricing Info */}
            <div className="mt-6 bg-indigo-900 bg-opacity-50 rounded-lg p-3 inline-flex items-center border border-indigo-700 hover:shadow-lg transition-all">
              <i className="fas fa-sync-alt text-indigo-300 mr-2" aria-hidden="true"></i>
              <span className="text-white text-sm font-medium">
                Start for <span className="font-bold">$29/month</span> with flexible payments. 
                <Link to="/pricing" className="underline ml-1">See plans</Link>
              </span>
            </div>
            
            {/* CTA Buttons */}
            <div className="mt-6 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0">
              <div className="flex flex-wrap gap-3">
                <Link 
                  to="/courses" 
                  className="flex-1 flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-900 bg-white hover:bg-gray-50 md:py-4 md:text-lg transition duration-300 transform hover:-translate-y-1 hover:shadow-lg"
                >
                  <i className="fas fa-laptop-code mr-2" aria-hidden="true"></i> Explore Courses
                </Link>
                <Link 
                  to="/login" 
                  className="flex-1 flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 md:py-4 md:text-lg transition duration-300 transform hover:-translate-y-1 hover:shadow-lg"
                >
                  <i className="fas fa-rocket mr-2" aria-hidden="true"></i> Get Started
                </Link>
              </div>
            </div>
            
            {/* Student Testimonials */}
            <div className="mt-8 flex items-center space-x-4">
              <div className="flex -space-x-2">
                <img 
                  className="inline-block h-10 w-10 rounded-full ring-2 ring-white" 
                  src="/images/student1.webp" 
                  alt="Student testimonial" 
                  width="40" 
                  height="40" 
                  loading="lazy" 
                />
                <img 
                  className="inline-block h-10 w-10 rounded-full ring-2 ring-white" 
                  src="/images/student2.webp" 
                  alt="Student testimonial" 
                  width="40" 
                  height="40" 
                  loading="lazy" 
                />
                <img 
                  className="inline-block h-10 w-10 rounded-full ring-2 ring-white" 
                  src="/images/student3.webp" 
                  alt="Student testimonial" 
                  width="40" 
                  height="40" 
                  loading="lazy" 
                />
              </div>
              <div className="text-sm text-blue-100">
                <p>Join 5,000+ students advancing their careers</p>
                <div className="flex items-center mt-1">
                  <div className="flex items-center">
                    <i className="fas fa-star text-yellow-400" aria-hidden="true"></i>
                    <i className="fas fa-star text-yellow-400" aria-hidden="true"></i>
                    <i className="fas fa-star text-yellow-400" aria-hidden="true"></i>
                    <i className="fas fa-star text-yellow-400" aria-hidden="true"></i>
                    <i className="fas fa-star text-yellow-400" aria-hidden="true"></i>
                  </div>
                  <span className="ml-2">4.9/5 (1,200+ reviews)</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Content - Hero Image */}
          <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
            <div className="relative mx-auto w-full rounded-xl shadow-2xl lg:max-w-md overflow-hidden border-4 border-white border-opacity-20 transform hover:scale-105 transition duration-500">
              <img 
                className="w-full h-auto" 
                src="/images/hero-image.webp" 
                alt="Student learning at Right Tech Centre" 
                width="600" 
                height="400" 
                loading="eager" 
              />
              <div className="absolute top-4 left-4 bg-indigo-600 text-white px-3 py-1 rounded-full text-xs font-bold animate-bounce">
                NEW: AI Courses
              </div>
              <div className="absolute bottom-4 right-4 bg-pink-600 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse">
                Trending Now
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Trusted Partners Scrolling Banner */}
      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-30 py-3 overflow-hidden z-10">
        <div className="flex items-center space-x-12 animate-scroll">
          <span className="text-sm text-white opacity-70 whitespace-nowrap">TRUSTED BY TECH LEADERS:</span>
          <img 
            src="/images/partner-1.webp" 
            alt="Tech Partner Logo" 
            className="h-8 opacity-70 hover:opacity-100 transition" 
            width="100" 
            height="32" 
            loading="lazy" 
          />
          <img 
            src="/images/partner-2.webp" 
            alt="Tech Partner Logo" 
            className="h-8 opacity-70 hover:opacity-100 transition" 
            width="100" 
            height="32" 
            loading="lazy" 
          />
          <img 
            src="/images/partner-3.webp" 
            alt="Tech Partner Logo" 
            className="h-8 opacity-70 hover:opacity-100 transition" 
            width="100" 
            height="32" 
            loading="lazy" 
          />
          <img 
            src="/images/partner-4.webp" 
            alt="Tech Partner Logo" 
            className="h-8 opacity-70 hover:opacity-100 transition" 
            width="100" 
            height="32" 
            loading="lazy" 
          />
          <img 
            src="/images/partner-5.webp" 
            alt="Tech Partner Logo" 
            className="h-8 opacity-70 hover:opacity-100 transition" 
            width="100" 
            height="32" 
            loading="lazy" 
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
