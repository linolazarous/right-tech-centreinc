import { useEffect, useState, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import { fetchLiveClasses } from '../services/liveClassService';

// Cache class with expiration
class LiveClassCache {
  constructor() {
    this.cache = {};
    this.expirationTime = 5 * 60 * 1000; // 5 minutes
  }

  get(key) {
    const item = this.cache[key];
    if (!item) return null;
    
    if (Date.now() > item.expiry) {
      delete this.cache[key];
      return null;
    }
    
    return item.value;
  }

  set(key, value) {
    this.cache[key] = {
      value,
      expiry: Date.now() + this.expirationTime
    };
  }

  clear() {
    this.cache = {};
  }
}

const cache = new LiveClassCache();

export default function useLiveClasses({
  enableCache = true,
  autoRefreshInterval = 0,
  maxRetries = 3,
  retryDelay = 1000
} = {}) {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const refreshIntervalRef = useRef(null);

  const fetchClasses = useCallback(async () => {
    const cacheKey = 'live-classes';
    
    try {
      setLoading(true);
      setError(null);

      // Check cache if enabled
      if (enableCache) {
        const cachedData = cache.get(cacheKey);
        if (cachedData) {
          setClasses(cachedData);
          setLastUpdated(new Date());
          setLoading(false);
          return;
        }
      }

      const data = await fetchLiveClasses();
      
      // Update state
      setClasses(data);
      setLastUpdated(new Date());
      setRetryCount(0);
      
      // Update cache if enabled
      if (enableCache) {
        cache.set(cacheKey, data);
      }
    } catch (err) {
      console.error('Error fetching live classes:', err);
      
      // Retry logic
      if (retryCount < maxRetries) {
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
          fetchClasses();
        }, retryDelay);
        return;
      }
      
      setError(err.message || 'Failed to load live classes');
    } finally {
      setLoading(false);
    }
  }, [enableCache, maxRetries, retryCount, retryDelay]);

  // Setup auto-refresh interval
  useEffect(() => {
    if (autoRefreshInterval > 0) {
      refreshIntervalRef.current = setInterval(() => {
        fetchClasses();
      }, autoRefreshInterval);
      
      return () => {
        if (refreshIntervalRef.current) {
          clearInterval(refreshIntervalRef.current);
        }
      };
    }
  }, [autoRefreshInterval, fetchClasses]);

  // Initial fetch and cleanup
  useEffect(() => {
    fetchClasses();
    
    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, [fetchClasses]);

  const refresh = useCallback(() => {
    if (enableCache) {
      cache.clear();
    }
    fetchClasses();
  }, [enableCache, fetchClasses]);

  return { 
    classes, 
    loading, 
    error, 
    refresh,
    lastUpdated,
    retryCount
  };
}

useLiveClasses.propTypes = {
  enableCache: PropTypes.bool,
  autoRefreshInterval: PropTypes.number,
  maxRetries: PropTypes.number,
  retryDelay: PropTypes.number
};
