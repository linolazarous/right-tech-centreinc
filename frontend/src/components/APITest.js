
import React, { useState, useEffect } from 'react';
import { checkAPIHealth } from '../services/api';
import { Toaster, toast } from 'react-hot-toast';

const APITest = () => {
  const [apiStatus, setApiStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    testAPI();
  }, []);

  const testAPI = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await checkAPIHealth();
      setApiStatus(response);
      toast.success('API connection successful!');
    } catch (err) {
      setError(err.message);
      toast.error('API connection failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    

      

        

          API Connection Test
        

        
        

          
            {loading ? 'Testing...' : 'Test API Connection'}
          
        


        {loading && (
          

            


              Testing connection to backend API...
            


          

        )}

        {error && (
          

            
Error:

            

{error}


          

        )}

        {apiStatus && (
          

            

              ✅ API Connection Successful!
            

            

              
                {JSON.stringify(apiStatus, null, 2)}
              

            

            


              Backend URL: {process.env.REACT_APP_API_BASE_URL}
            


          

        )}

        

          
API Information:

          


            Environment: {process.env.REACT_APP_ENVIRONMENT}

            API Base URL: {process.env.REACT_APP_API_BASE_URL}

            Current Time: {new Date().toLocaleString()}
          


        

      

      
    

  );
};

export default APITest;
                
