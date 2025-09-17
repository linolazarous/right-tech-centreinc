import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { 
  FiUsers, 
  FiBook, 
  FiBarChart2, 
  FiSettings, 
  FiPlusCircle,
  FiShield,
  FiDollarSign,
  FiVideo
} from 'react-icons/fi';

// Define the backend URL from the environment variable
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

// API call to check admin status
const checkAdminStatus = async () => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('No authentication token found');
    }

    // Use the absolute URL for the API call
    const response = await fetch(`${BACKEND_URL}/api/auth/status`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to verify admin status');
    }

    const data = await response.json();
    return data.isAdmin === true;
  } catch (error) {
    console.error('Admin verification failed:', error);
    return false;
  }
};

// API call to get admin stats
const fetchAdminStats = async () => {
  try {
    const token = localStorage.getItem('authToken');
    // Use the absolute URL for the API call
    const response = await fetch(`${BACKEND_URL}/api/admin/stats`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch admin stats');
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to fetch admin stats:', error);
    return null;
  }
};

const AdminPage = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyUser = async () => {
      const isAdminUser = await checkAdminStatus();
      
      if (!isAdminUser) {
        toast.error('Access denied: Admin privileges required');
        navigate('/');
        return;
      }

      setIsAdmin(true);
      
      // Fetch admin stats after verification
      const adminStats = await fetchAdminStats();
      setStats(adminStats);
      
      setLoading(false);
    };

    verifyUser();
  }, [navigate]);

  const adminCards = [
    {
      title: 'User Management',
      description: 'Manage users, roles, and permissions',
      icon: FiUsers,
      color: 'blue',
      path: '/admin/users'
    },
    {
      title: 'Course Management',
      description: 'Create, edit, and publish courses',
      icon: FiBook,
      color: 'green',
      path: '/admin/courses'
    },
    {
      title: 'Live Classes',
      description: 'Schedule and manage live sessions',
      icon: FiVideo,
      color: 'purple',
      path: '/admin/live-classes'
    },
    {
      title: 'Revenue & Payments',
      description: 'View earnings and payment reports',
      icon: FiDollarSign,
      color: 'yellow',
      path: '/admin/revenue'
    },
    {
      title: 'Analytics',
      description: 'Platform performance and insights',
      icon: FiBarChart2,
      color: 'indigo',
      path: '/admin/analytics'
    },
    {
      title: 'Site Settings',
      description: 'Configure platform settings',
      icon: FiSettings,
      color: 'gray',
      path: '/admin/settings'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Welcome back! Manage your platform and monitor performance.
          </p>
        </div>

        {/* Stats Overview */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-full">
                  <FiUsers className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalUsers || 0}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-full">
                  <FiBook className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Courses</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalCourses || 0}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 rounded-full">
                  <FiVideo className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Live Classes</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.liveClasses || 0}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 bg-yellow-100 rounded-full">
                  <FiDollarSign className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">${stats.revenue || 0}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <button
              onClick={() => navigate('/admin/courses/create')}
              className="flex items-center p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <FiPlusCircle className="w-6 h-6 text-green-600 mr-3" />
              <span>Create New Course</span>
            </button>
            
            <button
              onClick={() => navigate('/admin/live-classes/schedule')}
              className="flex items-center p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <FiVideo className="w-6 h-6 text-purple-600 mr-3" />
              <span>Schedule Live Class</span>
            </button>
            
            <button
              onClick={() => navigate('/admin/users/invite')}
              className="flex items-center p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <FiUsers className="w-6 h-6 text-blue-600 mr-3" />
              <span>Invite New User</span>
            </button>
          </div>
        </div>

        {/* Admin Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div
                key={index}
                onClick={() => navigate(card.path)}
                className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition-shadow transform hover:-translate-y-1 duration-200"
              >
                <div className="flex items-center mb-4">
                  <div className={`p-3 bg-${card.color}-100 rounded-full`}>
                    <Icon className={`w-6 h-6 text-${card.color}-600`} />
                  </div>
                  <h3 className="ml-4 text-lg font-semibold text-gray-900">{card.title}</h3>
                </div>
                <p className="text-gray-600 text-sm">{card.description}</p>
                <div className="mt-4 flex justify-end">
                  <span className={`text-${card.color}-600 text-sm font-medium`}>
                    Manage →
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Security Notice */}
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex">
            <FiShield className="w-5 h-5 text-yellow-600 mr-3" />
            <div>
              <h4 className="text-sm font-medium text-yellow-800">Security Notice</h4>
              <p className="text-sm text-yellow-700 mt-1">
                This area contains sensitive administrative functions. Ensure you follow 
                security best practices and log out when not in use.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
