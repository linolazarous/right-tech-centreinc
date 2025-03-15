import React, { useState } from 'react';
import { createTraining } from '../services/corporateTrainingService';

const CorporateTrainingForm = () => {
    const [programName, setProgramName] = useState('');
    const [companyName, setCompanyName] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        await createTraining({ programName, companyName });
        setProgramName('');
        setCompanyName('');
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Program Name"
                value={programName}
                onChange={(e) => setProgramName(e.target.value)}
            />
            <input
                type="text"
                placeholder="Company Name"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
            />
            <button type="submit">Create Training</button>
        </form>
    );
};

export default CorporateTrainingForm;