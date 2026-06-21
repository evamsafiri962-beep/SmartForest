import { useState, useEffect } from 'react';
import axios from 'axios';

export const useForest = () => {
  const [forest, setForest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchForest = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/officer/forest');
        if (res.data && res.data.name) {
          setForest(res.data);
        } else {
          setError('No forest data returned.');
        }
      } catch (err) {
        console.error('useForest error:', err);
        setError(err.response?.data?.message || 'Failed to fetch forest');
      } finally {
        setLoading(false);
      }
    };
    fetchForest();
  }, []);

  return { forest, loading, error };
};
