import { useState, useEffect } from 'react';

/**
 * Custom hook for loading data with automatic refresh
 * @param {Function} loadFn - Function that returns a Promise with the data to load
 * @param {Array} dependencies - Dependencies array for useEffect
 * @param {number} refreshInterval - Optional refresh interval in milliseconds
 * @returns {Object} - { data, loading, error, reload }
 */
export function useDataLoader(loadFn, dependencies = [], refreshInterval = null) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    try {
      setError(null);
      const result = await loadFn();
      setData(result);
      setLoading(false);
    } catch (err) {
      console.error('Error loading data:', err);
      setError(err.message || 'Failed to load data');
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    if (refreshInterval && refreshInterval > 0) {
      const interval = setInterval(loadData, refreshInterval);
      return () => clearInterval(interval);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  return { data, loading, error, reload: loadData };
}
