import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../layouts/PageLayout';
import { submitContactForm } from '../services/contactService';
import useFormValidation from '../hooks/useFormValidation';
import { loadReCaptcha } from 'react-recaptcha-v3';
import { logger } from '../utils/logger';
import { usePageTracking } from '../hooks/usePageTracking';
import ErrorBoundary from '../components/ErrorBoundary';
import { RECAPTCHA_SITE_KEY } from '../utils/constants';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    program: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const navigate = useNavigate();
  usePageTracking();

  const { validateForm } = useFormValidation();

  // Initialize reCAPTCHA
  useEffect(() => {
    if (RECAPTCHA_SITE_KEY) {
      loadReCaptcha(RECAPTCHA_SITE_KEY);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Form validation
    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Verify reCAPTCHA
    if (!recaptchaToken && RECAPTCHA_SITE_KEY) {
      logger.warn('reCAPTCHA verification missing');
      setErrors(prev => ({ ...prev, form: 'Please verify you are not a robot' }));
      return;
    }

    setSubmitting(true);
    try {
      await submitContactForm({
        ...formData,
        recaptchaToken
      });
      
      logger.info('Contact form submitted successfully', {
        formData: { ...formData, phone: 'REDACTED' } // Don't log full phone numbers
      });
      
      navigate('/contact/success', { 
        state: { 
          message: 'Thank you for your inquiry! We will contact you shortly.' 
        },
        replace: true
      });
    } catch (error) {
      logger.error('Contact form submission failed', error);
      navigate('/contact/error', {
        state: { 
          message: error.response?.data?.message || 'Submission failed. Please try again later.' 
        },
        replace: true
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Function to execute reCAPTCHA and get token
  const executeRecaptcha = async () => {
    if (typeof window.grecaptcha !== 'undefined' && RECAPTCHA_SITE_KEY) {
      try {
        const token = await window.grecaptcha.execute(RECAPTCHA_SITE_KEY, { action: 'contact' });
        setRecaptchaToken(token);
        // Clear any previous reCAPTCHA errors
        if (errors.form) {
          setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors.form;
            return newErrors;
          });
        }
      } catch (error) {
        logger.error('reCAPTCHA execution failed', error);
      }
    }
  };

  return (
    <PageLayout 
      title="Contact Us" 
      className="bg-gradient-to-b from-gray-50 to-white"
      seoTitle="Contact Us | Right Tech Centre"
      seoDescription="Get in touch with our admissions team for enrollment information and support"
    >
      <ErrorBoundary>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="lg:grid lg:grid-cols-2 lg:gap-12">
            <div data-aos="fade-right">
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                Get In Touch
              </h2>
              <p className="mt-3 text-lg text-gray-600">
                Our admissions team is ready to guide you through enrollment.
              </p>
              
              <div className="mt-8 space-y-6">
                <div className="flex">
                  <i className="fas fa-map-marker-alt text-indigo-600 mt-1 text-xl" aria-hidden="true"></i>
                  <div className="ml-4">
                    <p className="text-lg font-medium text-gray-900">Our Location</p>
                    <a 
                      href="https://maps.app.goo.gl/9QZ82aV4YVzFwBqA8" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="mt-1 text-gray-600 hover:text-indigo-600"
                    >
                      VGFM+98, North Gudele<br />Juba, South Sudan
                    </a>
                  </div>
                </div>
                
                <div className="flex">
                  <i className="fas fa-phone-alt text-indigo-600 mt-1 text-xl" aria-hidden="true"></i>
                  <div className="ml-4">
                    <p className="text-lg font-medium text-gray-900">Call Us</p>
                    <a href="tel:+211925522700" className="mt-1 text-gray-600 hover:text-indigo-600">
                      +211 925 522 700
                    </a>
                  </div>
                </div>
                
                <div className="flex">
                  <i className="fas fa-envelope text-indigo-600 mt-1 text-xl" aria-hidden="true"></i>
                  <div className="ml-4">
                    <p className="text-lg font-medium text-gray-900">Email Us</p>
                    <a href="mailto:righttechcentre@gmail.com" className="mt-1 text-gray-600 hover:text-indigo-600">
                      righttechcentre@gmail.com
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12 lg:mt-0" data-aos="fade-left">
              <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
                <h3 className="text-2xl font-bold text-gray-900">Enrollment Form</h3>
                
                {errors.form && (
                  <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-md">
                    {errors.form}
                  </div>
                )}
                
                <form 
                  onSubmit={handleSubmit}
                  className="mt-6 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8"
                >
                  <div>
                    <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">
                      First name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="first-name"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className={`py-3 px-4 block w-full shadow-sm ${
                        errors.firstName ? 'border-red-500' : 'border-gray-300'
                      } rounded-md`}
                      required
                    />
                    {errors.firstName && (
                      <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="last-name" className="block text-sm font-medium text-gray-700">
                      Last name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="last-name"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className={`py-3 px-4 block w-full shadow-sm ${
                        errors.lastName ? 'border-red-500' : 'border-gray-300'
                      } rounded-md`}
                      required
                    />
                    {errors.lastName && (
                      <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                    )}
                  </div>
                  
                  <div className="sm:col-span-2">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`py-3 px-4 block w-full shadow-sm ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      } rounded-md`}
                      required
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                    )}
                  </div>
                  
                  <div className="sm:col-span-2">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`py-3 px-4 block w-full shadow-sm ${
                        errors.phone ? 'border-red-500' : 'border-gray-300'
                      } rounded-md`}
                      required
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                    )}
                  </div>
                  
                  <div className="sm:col-span-2">
                    <label htmlFor="program" className="block text-sm font-medium text-gray-700">
                      Program of Interest <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="program"
                      name="program"
                      value={formData.program}
                      onChange={handleChange}
                      className={`py-3 px-4 block w-full shadow-sm ${
                        errors.program ? 'border-red-500' : 'border-gray-300'
                      } rounded-md`}
                      required
                    >
                      <option value="">-- Select a program --</option>
                      <optgroup label="Certifications">
                        <option value="Certified AI Engineer">Certified AI Engineer</option>
                        <option value="AWS Certified Architect">AWS Certified Architect</option>
                      </optgroup>
                      <optgroup label="Diploma Programs">
                        <option value="Diploma in Web Development">Diploma in Web Development</option>
                        <option value="Diploma in Artificial Intelligence">Diploma in Artificial Intelligence</option>
                      </optgroup>
                      <optgroup label="Degree Programs">
                        <option value="Bachelor of Artificial Intelligence">Bachelor of Artificial Intelligence</option>
                        <option value="Bachelor of Computer Science">Bachelor of Computer Science</option>
                      </optgroup>
                    </select>
                    {errors.program && (
                      <p className="mt-1 text-sm text-red-600">{errors.program}</p>
                    )}
                  </div>
                  
                  <div className="sm:col-span-2">
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      value={formData.message}
                      onChange={handleChange}
                      className="py-3 px-4 block w-full shadow-sm border-gray-300 rounded-md"
                    />
                  </div>
                  
                  <div className="sm:col-span-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      onClick={executeRecaptcha}
                      className={`w-full inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white ${
                        submitting 
                          ? 'bg-indigo-400' 
                          : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'
                      } transition-all`}
                    >
                      {submitting ? (
                        <>
                          <i className="fas fa-spinner fa-spin mr-2" aria-hidden="true"></i>
                          Processing...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-paper-plane mr-2" aria-hidden="true"></i>
                          Submit Application
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </ErrorBoundary>
    </PageLayout>
  );
};

export default React.memo(ContactPage);
