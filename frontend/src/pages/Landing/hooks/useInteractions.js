import { useState, useCallback } from 'react';

// Hook for navigation state management
export const useNavigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  const toggleMenu = useCallback(() => {
    setIsMenuOpen(prev => !prev);
  }, []);

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  const openMenu = useCallback(() => {
    setIsMenuOpen(true);
  }, []);

  const setSection = useCallback((section) => {
    setActiveSection(section);
  }, []);

  return {
    isMenuOpen,
    activeSection,
    toggleMenu,
    closeMenu,
    openMenu,
    setSection
  };
};

// Hook for form interactions (contact form, newsletter, etc.)
export const useFormActions = () => {
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const updateField = useCallback((field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const resetForm = useCallback(() => {
    setFormData({});
    setSubmitStatus(null);
  }, []);

  const submitForm = useCallback(async (endpoint, data = formData) => {
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        setSubmitStatus({ type: 'success', message: 'Form berhasil dikirim!' });
        resetForm();
      } else {
        throw new Error('Failed to submit form');
      }
    } catch (error) {
      setSubmitStatus({ 
        type: 'error', 
        message: 'Terjadi kesalahan. Silakan coba lagi.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, resetForm]);

  return {
    formData,
    isSubmitting,
    submitStatus,
    updateField,
    resetForm,
    submitForm
  };
};

// Hook for modal/dialog management
export const useModal = (initialState = false) => {
  const [isOpen, setIsOpen] = useState(initialState);
  const [modalData, setModalData] = useState(null);

  const openModal = useCallback((data = null) => {
    setModalData(data);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setModalData(null);
  }, []);

  const toggleModal = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  return {
    isOpen,
    modalData,
    openModal,
    closeModal,
    toggleModal
  };
};

// Hook for CTA (Call to Action) tracking and interactions
export const useCTAActions = () => {
  const [ctaClicks, setCTAClicks] = useState({});

  const trackCTAClick = useCallback((ctaId, action = 'click') => {
    setCTAClicks(prev => ({
      ...prev,
      [ctaId]: {
        ...prev[ctaId],
        [action]: (prev[ctaId]?.[action] || 0) + 1,
        lastClicked: new Date().toISOString()
      }
    }));

    // Send analytics event if needed
    if (typeof gtag !== 'undefined') {
      gtag('event', 'cta_click', {
        cta_id: ctaId,
        action: action
      });
    }
  }, []);

  const handleConsultationClick = useCallback(() => {
    trackCTAClick('consultation', 'click');
    // Additional logic for consultation flow
  }, [trackCTAClick]);

  const handlePortfolioClick = useCallback(() => {
    trackCTAClick('portfolio', 'click');
    // Additional logic for portfolio navigation
  }, [trackCTAClick]);

  const handleContactClick = useCallback(() => {
    trackCTAClick('contact', 'click');
    // Additional logic for contact form
  }, [trackCTAClick]);

  return {
    ctaClicks,
    trackCTAClick,
    handleConsultationClick,
    handlePortfolioClick,
    handleContactClick
  };
};