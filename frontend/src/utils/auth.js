
// Authentication utility functions

// Get authentication header
export const getAuthHeader = () => {
  const token = localStorage.getItem('authToken');
  if (token) {
    return { Authorization: `Bearer ${token}` };
  }
  return null;
};

// Check if user is authenticated
export const isAuthenticated = () => {
  const token = localStorage.getItem('authToken');
  if (!token) return false;
  
  // Check if token is expired (if it's a JWT)
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 > Date.now();
  } catch (error) {
    // If it's not a JWT or malformed, just check existence
    return true;
  }
};

// Get current user data
export const getCurrentUser = () => {
  try {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
};

// Logout user
export const logout = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('userData');
  window.dispatchEvent(new Event('logout'));
};

// Store auth data after login
export const setAuthData = (token, user) => {
  localStorage.setItem('authToken', token);
  if (user) {
    localStorage.setItem('userData', JSON.stringify(user));
  }
};

// Token refresh function (if your API supports it)
export const refreshToken = async () => {
  try {
    const response = await fetch('/api/auth/refresh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
    });
    
    if (response.ok) {
      const data = await response.json();
      setAuthData(data.token, data.user);
      return true;
    }
  } catch (error) {
    console.error('Token refresh failed:', error);
  }
  
  logout();
  return false;
};
                
