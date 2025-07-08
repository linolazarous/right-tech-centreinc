import React, { useEffect, useState } from 'react';
import { fetchCourses } from '../services/courseService';
import PageLayout from '../layouts/PageLayout';
import CourseCard from '../components/courses/CourseCard';
import LoadingSkeleton from '../components/ui/LoadingSkeleton';
import ErrorAlert from '../components/ui/ErrorAlert';

const CoursePage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('certification');

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const data = await fetchCourses();
        setCourses(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadCourses();
  }, []);

  const filteredCourses = courses.filter(course => {
    if (activeTab === 'certification') return course.type === 'certification';
    if (activeTab === 'diploma') return course.type === 'diploma';
    if (activeTab === 'degree') return course.type === 'degree';
    return true;
  });

  return (
    <PageLayout 
      title="Our Courses" 
      className="bg-gradient-to-br from-indigo-900 to-gray-900 text-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="lg:text-center" data-aos="fade-up">
          <h2 className="text-base text-teal-300 font-semibold tracking-wide uppercase">
            Future-Ready Programs
          </h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight sm:text-4xl">
            Cutting-Edge Course Catalog
          </p>
          <p className="mt-4 max-w-2xl text-xl text-indigo-100 lg:mx-auto">
            Industry-aligned programs designed for tomorrow's tech leaders
          </p>
        </div>

        <div className="mt-12">
          <div className="border-b border-gray-700">
            <nav className="-mb-px flex space-x-8 overflow-x-auto pb-4">
              {['certification', 'diploma', 'degree'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab
                      ? 'text-white border-pink-400'
                      : 'text-gray-300 border-transparent hover:text-white hover:border-gray-500'
                  } flex items-center`}
                >
                  <i 
                    className={`fas ${
                      tab === 'certification' ? 'fa-check-circle' :
                      tab === 'diploma' ? 'fa-certificate' : 'fa-graduation-cap'
                    } mr-2`} 
                    aria-hidden="true"
                  ></i>
                  {tab.charAt(0).toUpperCase() + tab.slice(1)} Programs
                </button>
              ))}
            </nav>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
              {[...Array(6)].map((_, i) => (
                <LoadingSkeleton key={i} />
              ))}
            </div>
          ) : error ? (
            <ErrorAlert message={error} onRetry={() => window.location.reload()} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
              {filteredCourses.map((course) => (
                <CourseCard 
                  key={course.id} 
                  course={course}
                  className="hover:shadow-lg transition-transform duration-300 hover:-translate-y-1"
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default CoursePage;
