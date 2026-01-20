import { useState } from 'react';

/**
 * Custom hook untuk mengelola filter dan timeframe budget
 */
export const useBudgetFilters = () => {
  const [timeframe, setTimeframe] = useState('month');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const handleTimeframeChange = (newTimeframe) => {
    setTimeframe(newTimeframe);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const resetFilters = () => {
    setTimeframe('month');
    setSelectedCategory('all');
  };

  return {
    timeframe,
    selectedCategory,
    handleTimeframeChange,
    handleCategoryChange,
    resetFilters
  };
};
