import React, { useState } from 'react';

const CareerCoaching = () => {
  const [selectedService, setSelectedService] = useState('');

  const services = [
    {
      id: 'resume-review',
      name: 'Resume Review',
      description: 'Get professional feedback on your resume',
      duration: '30 min',
      price: '$49'
    },
    {
      id: 'interview-prep',
      name: 'Interview Preparation',
      description: 'Mock interviews and feedback session',
      duration: '60 min',
      price: '$99'
    },
    {
      id: 'career-consultation',
      name: 'Career Consultation',
      description: 'One-on-one career guidance session',
      duration: '45 min',
      price: '$79'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-8">Career Coaching Services</h2>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        {services.map((service) => (
          <div
            key={service.id}
            className={`border rounded-lg p-6 cursor-pointer transition-all ${
              selectedService === service.id
                ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-indigo-300'
            }`}
            onClick={() => setSelectedService(service.id)}
          >
            <h3 className="text-lg font-semibold mb-2">{service.name}</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-3">{service.description}</p>
            <div className="flex justify-between text-sm">
              <span>{service.duration}</span>
              <span className="font-bold">{service.price}</span>
            </div>
          </div>
        ))}
      </div>

      {selectedService && (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Schedule Your Session</h3>
          <form className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <input
                type="text"
                placeholder="Full Name"
                className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="email"
                placeholder="Email Address"
                className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <textarea
              placeholder="What would you like to focus on?"
              rows={3}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700"
            >
              Schedule Now
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default CareerCoaching;
