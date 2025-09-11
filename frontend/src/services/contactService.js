import api from './api';

export const submitContactForm = async (formData) => {
  try {
    const response = await api.post('/contact', formData);
    return response.data;
  } catch (error) {
    console.error('Failed to submit contact form:', error);
    throw new Error(error.response?.data?.message || 'Failed to submit contact form');
  }
};

export const subscribeToNewsletter = async (email) => {
  try {
    const response = await api.post('/newsletter/subscribe', { email });
    return response.data;
  } catch (error) {
    console.error('Failed to subscribe to newsletter:', error);
    throw new Error(error.response?.data?.message || 'Failed to subscribe to newsletter');
  }
};

export const unsubscribeFromNewsletter = async (email) => {
  try {
    const response = await api.post('/newsletter/unsubscribe', { email });
    return response.data;
  } catch (error) {
    console.error('Failed to unsubscribe from newsletter:', error);
    throw new Error(error.response?.data?.message || 'Failed to unsubscribe from newsletter');
  }
};

export const requestDemo = async (demoData) => {
  try {
    const response = await api.post('/demo/request', demoData);
    return response.data;
  } catch (error) {
    console.error('Failed to request demo:', error);
    throw new Error(error.response?.data?.message || 'Failed to request demo');
  }
};

export const getContactInfo = async () => {
  try {
    const response = await api.get('/contact/info');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch contact information:', error);
    throw new Error(error.response?.data?.message || 'Failed to load contact information');
  }
};

export const sendSupportTicket = async (ticketData) => {
  try {
    const response = await api.post('/support/ticket', ticketData);
    return response.data;
  } catch (error) {
    console.error('Failed to submit support ticket:', error);
    throw new Error(error.response?.data?.message || 'Failed to submit support ticket');
  }
};

export const getFaqs = async () => {
  try {
    const response = await api.get('/faqs');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch FAQs:', error);
    throw new Error(error.response?.data?.message || 'Failed to load FAQs');
  }
};

export default {
  submitContactForm,
  subscribeToNewsletter,
  unsubscribeFromNewsletter,
  requestDemo,
  getContactInfo,
  sendSupportTicket,
  getFaqs
};
