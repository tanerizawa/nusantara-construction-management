// Landing Page Configuration
export const LANDING_CONFIG = {
  // Animation settings
  animation: {
    testimonialRotationInterval: 5000,
    counterAnimationDuration: 2000,
    scrollBehavior: 'smooth',
    defaultTransition: 'transition-all duration-300'
  },
  
  // Layout settings
  layout: {
    heroHeight: 'min-h-screen',
    sectionPadding: 'py-20',
    containerMaxWidth: 'max-w-7xl',
    gridBreakpoints: {
      mobile: 'grid-cols-1',
      tablet: 'md:grid-cols-2',
      desktop: 'lg:grid-cols-3'
    }
  },
  
  // Social media links
  socialMedia: {
    linkedin: '#',
    instagram: '#',
    email: 'info@nusantaragroup.co.id',
    phone: '+62 267 123456'
  },
  
  // Company contact info
  contact: {
    address: 'Jl. Raya Karawang No. 123, Karawang Barat, Kab. Karawang',
    phone: '+62 267 123456',
    email: 'info@nusantaragroup.co.id',
    workingHours: 'Senin - Jumat: 08:00 - 17:00 WIB'
  },
  
  // Navigation items
  navigation: [
    { href: '#home', label: 'Beranda' },
    { href: '#about', label: 'Tentang' },
    { href: '#services', label: 'Layanan' },
    { href: '#projects', label: 'Proyek' },
    { href: '#contact', label: 'Kontak' }
  ],
  
  // CTA buttons
  ctaButtons: {
    primary: {
      text: 'Konsultasi Gratis',
      href: '#contact',
      className: 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
    },
    secondary: {
      text: 'Lihat Portofolio',
      href: '#projects',
      className: 'bg-white/90 backdrop-blur-sm border-2 border-gray-200 text-gray-700'
    }
  }
};

// Trust badges configuration
export const TRUST_BADGES = [
  'LPSE Karawang',
  'KADIN Karawang', 
  'ISO 9001:2015',
  'SMK3 Certified'
];

// Theme configuration
export const THEME_CONFIG = {
  colors: {
    primary: 'blue-600',
    secondary: 'indigo-600',
    accent: 'purple-600',
    success: 'green-600',
    warning: 'orange-600',
    danger: 'red-600'
  },
  gradients: {
    primary: 'from-blue-600 to-indigo-600',
    secondary: 'from-purple-400 to-purple-600',
    accent: 'from-orange-400 to-orange-600',
    hero: 'from-blue-50 via-indigo-50 to-purple-50'
  },
  shadows: {
    card: 'shadow-xl hover:shadow-2xl',
    button: 'shadow-lg hover:shadow-xl',
    floating: 'shadow-2xl'
  }
};