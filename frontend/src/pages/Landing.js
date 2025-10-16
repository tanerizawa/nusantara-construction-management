// Legacy Landing.js - Now using modular architecture
// Original 927-line monolithic file has been modularized into 20+ focused files
// For detailed implementation, see: /src/pages/Landing/

// Export default Landing component
export { default } from './Landing/Landing';

// Re-export sections for backward compatibility
export {
  HeroSection,
  AboutSection,
  ServicesSection,
  TestimonialsSection,
  ContactSection
} from './Landing/index';

// Re-export components
export {
  Navigation,
  Footer,
  StatsCard,
  TrustBadges,
  CTAButtons
} from './Landing/index';

// Re-export hooks
export {
  useLandingData,
  useTestimonialCarousel,
  useSmoothScroll,
  useAnimatedCounter,
  useIntersectionObserver,
  useNavigation,
  useFormActions,
  useModal,
  useCTAActions
} from './Landing/index';

// Re-export configuration
export {
  LANDING_CONFIG,
  TRUST_BADGES,
  THEME_CONFIG,
  COMPANY_STATS,
  SERVICES_DATA,
  CLIENTS_DATA,
  TESTIMONIALS_DATA,
  ABOUT_DATA,
  WHY_CHOOSE_US_DATA
} from './Landing/index';
