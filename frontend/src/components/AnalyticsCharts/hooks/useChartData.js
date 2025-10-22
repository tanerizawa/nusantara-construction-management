import { useState, useEffect, useRef } from 'react';

/**
 * Hook for fetching and managing chart data
 * @param {string} chartType - Type of chart data to fetch
 * @param {object} mockData - Mock data to use as fallback
 * @param {function} fetchFn - Optional API fetch function
 * @returns {object} Chart data state and loading status
 */
export const useChartData = (chartType, mockData, fetchFn = null) => {
  const [data, setData] = useState(mockData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // If no fetch function is provided, use mock data
    if (!fetchFn) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const result = await fetchFn(chartType);
        setData(result);
      } catch (err) {
        console.error(`Error fetching ${chartType} chart data:`, err);
        setError(err.message || 'Failed to load chart data');
        // Fallback to mock data on error
        setData(mockData);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [chartType, mockData, fetchFn]);

  return { data, loading, error };
};

/**
 * Hook for responsive chart sizing
 * @returns {object} Dimensions and ref for responsive container
 */
export const useChartSize = () => {
  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 300 // Default height
  });
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;

    const resizeObserver = new ResizeObserver(entries => {
      if (!entries[0]) return;
      const { width } = entries[0].contentRect;
      setDimensions({ width, height: 300 });
    });

    resizeObserver.observe(ref.current);

    return () => {
      if (ref.current) {
        resizeObserver.unobserve(ref.current);
      }
      resizeObserver.disconnect();
    };
  }, []);

  return { dimensions, ref };
};

export default {
  useChartData,
  useChartSize
};
