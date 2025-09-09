import React from 'react';

const TestimonialsSection = () => {
  return (
    <section id="testimonials" className="py-16 bg-white dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Testimonials</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            What Our Students Say
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-300 lg:mx-auto">
            Thousands of learners have transformed their careers. Here's what they say.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Testimonial 1 */}
          <div className="bg-gray-50 dark:bg-gray-700 p-8 rounded-xl shadow-md">
            <blockquote className="text-gray-600 dark:text-gray-200">
              <i className="fas fa-quote-left text-indigo-200 dark:text-indigo-400 text-3xl" aria-hidden="true"></i>
              <p className="mt-4">
                The AI Engineering program was a game-changer. The hands-on projects and mentorship helped me land a job at a top tech company before I even graduated.
              </p>
            </blockquote>
            <figcaption className="mt-6 flex items-center">
              <img 
                className="h-12 w-12 rounded-full" 
                src="/images/student-1.webp" 
                alt="Photo of Alex Johnson" 
                loading="lazy" 
              />
              <div className="ml-4">
                <div className="font-bold text-gray-900 dark:text-white">Alex Johnson</div>
                <div className="text-sm text-gray-500 dark:text-gray-300">Certified AI Engineer</div>
              </div>
            </figcaption>
          </div>

          {/* Testimonial 2 */}
          <div className="bg-gray-50 dark:bg-gray-700 p-8 rounded-xl shadow-md">
            <blockquote className="text-gray-600 dark:text-gray-200">
              <i className="fas fa-quote-left text-indigo-200 dark:text-indigo-400 text-3xl" aria-hidden="true"></i>
              <p className="mt-4">
                I enrolled in the Cybersecurity diploma to switch careers. The flexible payment plan made it affordable, and the curriculum was incredibly relevant to the industry's needs.
              </p>
            </blockquote>
            <figcaption className="mt-6 flex items-center">
              <img 
                className="h-12 w-12 rounded-full" 
                src="/images/student-2.webp" 
                alt="Photo of Maria Garcia" 
                loading="lazy" 
              />
              <div className="ml-4">
                <div className="font-bold text-gray-900 dark:text-white">Maria Garcia</div>
                <div className="text-sm text-gray-500 dark:text-gray-300">Diploma in Cybersecurity</div>
              </div>
            </figcaption>
          </div>

          {/* Testimonial 3 */}
          <div className="bg-gray-50 dark:bg-gray-700 p-8 rounded-xl shadow-md">
            <blockquote className="text-gray-600 dark:text-gray-200">
              <i className="fas fa-quote-left text-indigo-200 dark:text-indigo-400 text-3xl" aria-hidden="true"></i>
              <p className="mt-4">
                The self-paced structure of the Web Development diploma allowed me to learn while working full-time. The support from instructors was outstanding.
              </p>
            </blockquote>
            <figcaption className="mt-6 flex items-center">
              <img 
                className="h-12 w-12 rounded-full" 
                src="/images/student-3.webp" 
                alt="Photo of Samuel Chen" 
                loading="lazy" 
              />
              <div className="ml-4">
                <div className="font-bold text-gray-900 dark:text-white">Samuel Chen</div>
                <div className="text-sm text-gray-500 dark:text-gray-300">Diploma in Web Development</div>
              </div>
            </figcaption>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
