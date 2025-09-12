import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// This is a placeholder for your actual API call to check user status
const checkAdminStatus = async () => {
  // In a real app, you would make an API call to your backend:
  // const { data } = await axios.get('/api/auth/status');
  // return data.isAdmin;

  // For now, we'll simulate an admin user for demonstration.
  // In production, you MUST replace this with a real authentication check.
  console.warn("Using placeholder authentication. This is not secure for production.");
  const user = JSON.parse(localStorage.getItem('userData')); // Example check
  return user && user.role === 'admin';
};


const AdminPage = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyUser = async () => {
      const isAdminUser = await checkAdminStatus();
      if (!isAdminUser) {
        // If the user is not an admin, redirect them to the home page.
        console.log("Access Denied: User is not an admin. Redirecting...");
        navigate('/');
      } else {
        setIsAdmin(true);
      }
      setLoading(false);
    };

    verifyUser();
  }, [navigate]);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}><h1>Verifying access...</h1></div>;
  }

  if (!isAdmin) {
    // This is a fallback, the redirect should have already happened.
    return null;
  }

  // If the user is an admin, show the admin dashboard.
  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: 'auto' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', borderBottom: '2px solid #eee', paddingBottom: '1rem' }}>Admin Dashboard</h1>
      <p>Welcome, Administrator!</p>
      
      <div style={{ marginTop: '2rem', display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
        {/* Example Admin Panels */}
        <div style={{ border: '1px solid #ddd', padding: '1rem', borderRadius: '8px' }}>
          <h2>User Management</h2>
          <p>View, edit, or remove users.</p>
        </div>
        <div style={{ border: '1px solid #ddd', padding: '1rem', borderRadius: '8px' }}>
          <h2>Course Management</h2>
          <p>Add, update, or publish courses.</p>
        </div>
        <div style={{ border: '1px solid #ddd', padding: '1rem', borderRadius: '8px' }}>
          <h2>Site Analytics</h2>
          <p>Review website traffic and engagement.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
