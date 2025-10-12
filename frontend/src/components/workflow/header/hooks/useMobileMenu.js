import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook untuk mobile menu drawer
 * 
 * Features:
 * - Toggle open/close
 * - Lock body scroll when open
 * - Handle ESC key
 * - Manage sub-menu expansion
 * 
 * @returns {object} Mobile menu state and handlers
 */
export const useMobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState(null);

  // Toggle menu open/close
  const toggleMenu = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  // Open menu
  const openMenu = useCallback(() => {
    setIsOpen(true);
  }, []);

  // Close menu
  const closeMenu = useCallback(() => {
    setIsOpen(false);
    // Reset expanded category when closing
    setTimeout(() => {
      setExpandedCategory(null);
    }, 300); // Wait for animation
  }, []);

  // Toggle category expansion
  const toggleCategory = useCallback((categoryId) => {
    setExpandedCategory(prev => prev === categoryId ? null : categoryId);
  }, []);

  // Check if category is expanded
  const isCategoryExpanded = useCallback((categoryId) => {
    return expandedCategory === categoryId;
  }, [expandedCategory]);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      // Save current scroll position
      const scrollY = window.scrollY;
      
      // Lock scroll
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      
      return () => {
        // Restore scroll
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);

  // Handle ESC key to close
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape' && isOpen) {
        closeMenu();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, closeMenu]);

  return {
    isOpen,
    expandedCategory,
    toggleMenu,
    openMenu,
    closeMenu,
    toggleCategory,
    isCategoryExpanded
  };
};

export default useMobileMenu;
