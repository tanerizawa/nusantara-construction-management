import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook untuk dropdown menu interactions
 * 
 * Features:
 * - Click to toggle
 * - Hover to open (desktop)
 * - Click outside to close
 * - ESC key to close
 * - Configurable hover delay
 * 
 * @param {number} hoverDelay - Delay before opening on hover (ms)
 * @returns {object} Dropdown state and handlers
 */
export const useDropdown = (hoverDelay = 150) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const dropdownRef = useRef(null);
  const hoverTimeoutRef = useRef(null);
  const leaveTimeoutRef = useRef(null);

  // Handle click toggle
  const handleClick = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  // Handle mouse enter (with delay)
  const handleMouseEnter = useCallback(() => {
    // Clear any pending leave timeout
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
      leaveTimeoutRef.current = null;
    }

    setIsHovered(true);

    // Open after delay
    hoverTimeoutRef.current = setTimeout(() => {
      setIsOpen(true);
    }, hoverDelay);
  }, [hoverDelay]);

  // Handle mouse leave (with grace period)
  const handleMouseLeave = useCallback(() => {
    // Clear any pending open timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }

    setIsHovered(false);

    // Close after grace period (300ms)
    leaveTimeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 300);
  }, []);

  // Close dropdown
  const closeDropdown = useCallback(() => {
    setIsOpen(false);
    setIsHovered(false);
    
    // Clear all timeouts
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
      leaveTimeoutRef.current = null;
    }
  }, []);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        closeDropdown();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, closeDropdown]);

  // Handle ESC key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape' && isOpen) {
        closeDropdown();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, closeDropdown]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
      if (leaveTimeoutRef.current) {
        clearTimeout(leaveTimeoutRef.current);
      }
    };
  }, []);

  return {
    isOpen,
    isHovered,
    dropdownRef,
    handleClick,
    handleMouseEnter,
    handleMouseLeave,
    closeDropdown,
    setIsOpen
  };
};

export default useDropdown;
