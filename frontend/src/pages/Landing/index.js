// Main Landing Page Component
export { default } from './Landing';

// Individual Sections (for custom compositions)
export { HeroSection } from './sections/HeroSection';
export { AboutSection } from './sections/AboutSection';
export { ServicesSection } from './sections/ServicesSection';
export { TestimonialsSection } from './sections/TestimonialsSection';
export { ContactSection } from './sections/ContactSection';

// Reusable Components
export { Navigation } from './components/Navigation';
export { Footer } from './components/Footer';
export { StatsCard, TrustBadges, CTAButtons } from './components/UIComponents';

// Hooks (for external usage)
export { 
  useLandingData,
  useTestimonialCarousel,
  useSmoothScroll,
  useAnimatedCounter,
  useIntersectionObserver
} from './hooks/useLandingData';

export {
  useNavigation,
  useFormActions,
  useModal,
  useCTAActions
} from './hooks/useInteractions';

// Configuration (for customization)
export { 
  LANDING_CONFIG,
  TRUST_BADGES,
  THEME_CONFIG
} from './config/landingConfig';

export {
  COMPANY_STATS,
  SERVICES_DATA,
  CLIENTS_DATA,
  TESTIMONIALS_DATA,
  ABOUT_DATA,
  WHY_CHOOSE_US_DATA
} from './config/contentData';