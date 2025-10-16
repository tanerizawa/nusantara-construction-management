import { useState, useEffect } from 'react';
import { apiClient } from '../../../services/api';

// Hook for managing landing page data
export const useLandingData = () => {
  const [stats, setStats] = useState(null);
  const [recentProjects, setRecentProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch landing page stats
  const fetchStats = async () => {
    try {
      const response = await apiClient.get('/stats/overview');
      if (response.data?.success) {
        setStats(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
      setError('Failed to load statistics');
    }
  };

  // Fetch recent projects for showcase
  const fetchRecentProjects = async () => {
    try {
      const response = await apiClient.get('/stats/recent-projects?limit=6');
      if (response.data?.success) {
        setRecentProjects(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching recent projects:', err);
      setError('Failed to load recent projects');
    }
  };

  // Initialize data on mount
  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchStats(),
          fetchRecentProjects()
        ]);
      } catch (err) {
        setError('Failed to initialize landing page data');
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, []);

  return {
    stats,
    recentProjects,
    loading,
    error,
    refetch: () => {
      fetchStats();
      fetchRecentProjects();
    }
  };
};

// Hook for testimonial carousel
export const useTestimonialCarousel = (testimonials = [], autoRotate = true, interval = 5000) => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [isAutoRotating, setIsAutoRotating] = useState(autoRotate);

  // Auto-rotate testimonials
  useEffect(() => {
    if (!isAutoRotating || testimonials.length <= 1) return;

    const rotationInterval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, interval);

    return () => clearInterval(rotationInterval);
  }, [testimonials.length, isAutoRotating, interval]);

  const goToTestimonial = (index) => {
    setActiveTestimonial(index);
    setIsAutoRotating(false);
    
    // Resume auto-rotation after 10 seconds
    setTimeout(() => setIsAutoRotating(true), 10000);
  };

  const nextTestimonial = () => {
    goToTestimonial((activeTestimonial + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    goToTestimonial(activeTestimonial === 0 ? testimonials.length - 1 : activeTestimonial - 1);
  };

  return {
    activeTestimonial,
    goToTestimonial,
    nextTestimonial,
    prevTestimonial,
    isAutoRotating,
    setIsAutoRotating
  };
};

// Hook for smooth scrolling behavior
export const useSmoothScroll = () => {
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return { scrollToSection };
};

// Hook for animated counters
export const useAnimatedCounter = (targetValue, duration = 2000, startOnMount = true) => {
  const [currentValue, setCurrentValue] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const startAnimation = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    const startTime = Date.now();
    const startValue = currentValue;
    const valueChange = targetValue - startValue;

    const animateCounter = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
      const easedProgress = progress * (2 - progress);
      const newValue = Math.round(startValue + (valueChange * easedProgress));
      
      setCurrentValue(newValue);
      
      if (progress < 1) {
        requestAnimationFrame(animateCounter);
      } else {
        setIsAnimating(false);
      }
    };

    requestAnimationFrame(animateCounter);
  };

  useEffect(() => {
    if (startOnMount && targetValue > 0) {
      startAnimation();
    }
  }, [targetValue, startOnMount]);

  return {
    currentValue,
    startAnimation,
    isAnimating,
    reset: () => setCurrentValue(0)
  };
};

// Hook for intersection observer (scroll animations)
export const useIntersectionObserver = (options = {}) => {
  const [elementRef, setElementRef] = useState(null);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);

  useEffect(() => {
    if (!elementRef) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
        if (entry.isIntersecting && !hasIntersected) {
          setHasIntersected(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
        ...options
      }
    );

    observer.observe(elementRef);

    return () => {
      observer.disconnect();
    };
  }, [elementRef, hasIntersected, options]);

  return {
    elementRef: setElementRef,
    isIntersecting,
    hasIntersected
  };
};