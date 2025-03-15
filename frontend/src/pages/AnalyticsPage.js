import React from 'react';
import AnalyticsDashboard from '../components/AnalyticsDashboard';

const AnalyticsPage = () => {
    const userId = localStorage.getItem('userId'); // Replace with actual user ID
    return (
        <div>
            <AnalyticsDashboard userId={userId} />
        </div>
    );
};

export default AnalyticsPage;