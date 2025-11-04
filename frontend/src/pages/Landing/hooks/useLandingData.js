import { useState, useEffect } from 'react';

// Hook for managing landing page data
// FIXED: Use static data instead of real API calls for public landing page
export const useLandingData = () => {
  const [loading, setLoading] = useState(false); // No loading needed for static data
  const [error, setError] = useState(null);

  // Static stats data for landing page (not real data)
  const stats = {
    totalProjects: 150,      // Static number for showcase
    activeProjects: 25,      // Static number for showcase
    completedProjects: 125,  // Static number for showcase
    totalValue: 75000000000  // Static number for showcase (75 Miliar)
  };

  // Static recent projects showcase data
  const recentProjects = [
    {
      id: 'showcase-1',
      name: 'Pembangunan Gedung Perkantoran',
      client: 'PT. Modern Office',
      location: 'Jakarta Selatan',
      status: 'completed',
      image: '/images/projects/office-building.svg',
      imageJpg: '/images/projects/office-building.jpg',
      imageWebp: '/images/projects/office-building.webp',
      value: 15000000000
    },
    {
      id: 'showcase-2',
      name: 'Konstruksi Jalan Tol',
      client: 'Pemerintah DKI Jakarta',
      location: 'Jakarta Timur',
      status: 'active',
      image: '/images/projects/highway.svg',
      imageJpg: '/images/projects/highway.jpg',
      imageWebp: '/images/projects/highway.webp',
      value: 50000000000
    },
    {
      id: 'showcase-3',
      name: 'Renovasi Gedung Sekolah',
      client: 'Dinas Pendidikan',
      location: 'Tangerang',
      status: 'completed',
      image: '/images/projects/school.svg',
      imageJpg: '/images/projects/school.jpg',
      imageWebp: '/images/projects/school.webp',
      value: 5000000000
    }
  ];

  return {
    stats,
    recentProjects,
    loading,
    error,
    refetch: () => {
      // No-op for static data
      console.log('Landing page using static showcase data');
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
