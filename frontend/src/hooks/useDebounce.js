import { useState, useEffect } from 'react';

/**
 * Custom hook untuk debouncing values
 * Menunda update value hingga user berhenti mengetik untuk delay tertentu
 * 
 * @param {any} value - Value yang akan di-debounce
 * @param {number} delay - Delay dalam milliseconds (default: 300ms)
 * @returns {any} Debounced value
 * 
 * @example
 * const [searchTerm, setSearchTerm] = useState('');
 * const debouncedSearchTerm = useDebounce(searchTerm, 300);
 * 
 * useEffect(() => {
 *   // API call hanya terjadi setelah user berhenti mengetik 300ms
 *   fetchResults(debouncedSearchTerm);
 * }, [debouncedSearchTerm]);
 */
export const useDebounce = (value, delay = 300) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Set timeout untuk update debounced value
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup function: cancel timeout jika value berubah sebelum delay selesai
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

/**
 * Custom hook untuk debouncing dengan loading state
 * Mengembalikan debounced value dan flag isDebouncing
 * 
 * @param {any} value - Value yang akan di-debounce
 * @param {number} delay - Delay dalam milliseconds (default: 300ms)
 * @returns {{debouncedValue: any, isDebouncing: boolean}} Object dengan debounced value dan loading state
 * 
 * @example
 * const [searchTerm, setSearchTerm] = useState('');
 * const { debouncedValue, isDebouncing } = useDebouncedValue(searchTerm, 300);
 * 
 * return (
 *   <div>
 *     <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
 *     {isDebouncing && <Spinner />}
 *   </div>
 * );
 */
export const useDebouncedValue = (value, delay = 300) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  const [isDebouncing, setIsDebouncing] = useState(false);

  useEffect(() => {
    // Set debouncing to true saat value berubah
    setIsDebouncing(true);

    // Set timeout untuk update debounced value
    const handler = setTimeout(() => {
      setDebouncedValue(value);
      setIsDebouncing(false);
    }, delay);

    // Cleanup function: cancel timeout jika value berubah sebelum delay selesai
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return { debouncedValue, isDebouncing };
};

/**
 * Custom hook untuk debouncing callback function
 * Menunda eksekusi function hingga user berhenti trigger untuk delay tertentu
 * 
 * @param {Function} callback - Function yang akan di-debounce
 * @param {number} delay - Delay dalam milliseconds (default: 300ms)
 * @returns {Function} Debounced callback function
 * 
 * @example
 * const handleSearch = useDebouncedCallback((value) => {
 *   fetchResults(value);
 * }, 300);
 * 
 * return <input onChange={e => handleSearch(e.target.value)} />;
 */
export const useDebouncedCallback = (callback, delay = 300) => {
  const [timeoutId, setTimeoutId] = useState(null);

  useEffect(() => {
    // Cleanup timeout saat component unmount
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [timeoutId]);

  const debouncedCallback = (...args) => {
    // Clear previous timeout
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // Set new timeout
    const newTimeoutId = setTimeout(() => {
      callback(...args);
    }, delay);

    setTimeoutId(newTimeoutId);
  };

  return debouncedCallback;
};

export default useDebounce;
