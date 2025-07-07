import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTraining } from '../services/corporateTrainingService';
import { logError } from '../utils/monitoring';
import useFormValidation from '../hooks/useFormValidation';
import LoadingSpinner from './ui/LoadingSpinner';
import './CorporateTrainingForm.css';

const CorporateTrainingForm = () => {
    const [formData, setFormData] = useState({
        programName: '',
        companyName: '',
        contactEmail: '',
        participants: 1,
        startDate: '',
        duration: '4 weeks',
        requirements: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();
    const { validateForm } = useFormValidation();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess(false);

        // Validate form
        const errors = validateForm(formData, {
            programName: { required: true, minLength: 5 },
            companyName: { required: true },
            contactEmail: { required: true, type: 'email' },
            startDate: { required: true, futureDate: true }
        });

        if (Object.keys(errors).length > 0) {
            setError('Please correct the highlighted fields');
            return;
        }

        setIsLoading(true);

        try {
            await createTraining(formData);
            setSuccess(true);
            setTimeout(() => navigate('/training-success'), 1500);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create training program');
            logError(err, { formData });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="training-form-container">
            <h2 className="form-title">Corporate Training Request</h2>
            
            {error && (
                <div className="form-error" role="alert">
                    <i className="fas fa-exclamation-circle" aria-hidden="true"></i>
                    {error}
                </div>
            )}

            {success && (
                <div className="form-success" role="status">
                    <i className="fas fa-check-circle" aria-hidden="true"></i>
                    Training program created successfully!
                </div>
            )}

            <form onSubmit={handleSubmit} className="training-form" noValidate>
                <div className="form-group">
                    <label htmlFor="programName">Program Name *</label>
                    <input
                        id="programName"
                        name="programName"
                        type="text"
                        value={formData.programName}
                        onChange={handleChange}
                        required
                        minLength="5"
                        placeholder="e.g., Advanced React Development"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="companyName">Company Name *</label>
                    <input
                        id="companyName"
                        name="companyName"
                        type="text"
                        value={formData.companyName}
                        onChange={handleChange}
                        required
                        placeholder="Your company name"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="contactEmail">Contact Email *</label>
                    <input
                        id="contactEmail"
                        name="contactEmail"
                        type="email"
                        value={formData.contactEmail}
                        onChange={handleChange}
                        required
                        placeholder="training.coordinator@company.com"
                    />
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="participants">Number of Participants</label>
                        <select
                            id="participants"
                            name="participants"
                            value={formData.participants}
                            onChange={handleChange}
                        >
                            {[...Array(20).keys()].map(i => (
                                <option key={i+1} value={i+1}>{i+1}</option>
                            ))}
                            <option value="20+">20+ (Contact us)</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="duration">Program Duration</label>
                        <select
                            id="duration"
                            name="duration"
                            value={formData.duration}
                            onChange={handleChange}
                        >
                            <option value="4 weeks">4 weeks</option>
                            <option value="8 weeks">8 weeks</option>
                            <option value="12 weeks">12 weeks</option>
                            <option value="custom">Custom duration</option>
                        </select>
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="startDate">Preferred Start Date *</label>
                    <input
                        id="startDate"
                        name="startDate"
                        type="date"
                        value={formData.startDate}
                        onChange={handleChange}
                        required
                        min={new Date().toISOString().split('T')[0]}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="requirements">Special Requirements</label>
                    <textarea
                        id="requirements"
                        name="requirements"
                        value={formData.requirements}
                        onChange={handleChange}
                        placeholder="Any specific topics, technologies, or scheduling needs"
                        rows="4"
                    />
                </div>

                <div className="form-actions">
                    <button 
                        type="submit" 
                        className="submit-button"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <LoadingSpinner size="small" />
                        ) : (
                            'Request Training Program'
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CorporateTrainingForm;
