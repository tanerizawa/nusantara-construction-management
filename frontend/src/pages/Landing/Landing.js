// Modular Landing.js - Main orchestrating component
// Original 927-line monolithic file has been modularized into 20+ focused files
// For detailed implementation, see: /src/pages/Landing/

import React from 'react';
import { Building2, Clock, CheckCircle, DollarSign } from 'lucide-react';
import { Navigation } from './components/Navigation';
import { HeroSection } from './sections/HeroSection';
import { AboutSection } from './sections/AboutSection';
import { ServicesSection } from './sections/ServicesSection';
import { TestimonialsSection } from './sections/TestimonialsSection';
import { ContactSection } from './sections/ContactSection';
import { Footer } from './components/Footer';

// Hooks
import { useLandingData } from './hooks/useLandingData';
import { useNavigation } from './hooks/useInteractions';
import { useSmoothScroll } from './hooks/useLandingData';

// Configuration
import { COMPANY_STATS } from './config/contentData';

// Helper function to transform API stats to display format
const transformStatsToDisplay = (apiStats) => {
  if (!apiStats) return COMPANY_STATS;
  
  return [
    { 
      number: `${apiStats.totalProjects || 0}`, 
      label: 'Total Proyek', 
      icon: Building2,
      description: 'Proyek yang telah dikerjakan',
      color: 'from-blue-400 to-blue-600'
    },
    { 
      number: `${apiStats.activeProjects || 0}`, 
      label: 'Proyek Aktif', 
      icon: Clock,
      description: 'Proyek yang sedang berjalan',
      color: 'from-green-400 to-green-600'
    },
    { 
      number: `${apiStats.completedProjects || 0}`, 
      label: 'Proyek Selesai', 
      icon: CheckCircle,
      description: 'Proyek yang telah selesai',
      color: 'from-purple-400 to-purple-600'
    },
    { 
      number: apiStats.totalValue ? `Rp ${(apiStats.totalValue / 1000000000).toFixed(1)}M` : 'Rp 0', 
      label: 'Total Nilai Proyek', 
      icon: DollarSign,
      description: 'Nilai total proyek',
      color: 'from-orange-400 to-orange-600'
    }
  ];
};

const Landing = () => {
  // Data management
  const { stats, recentProjects, loading, error } = useLandingData();
  
  // Navigation state
  const { isMenuOpen, activeSection, toggleMenu, setSection } = useNavigation();
  
  // Smooth scrolling
  useSmoothScroll();

  // Transform API stats to display format or use fallback
  const displayStats = transformStatsToDisplay(stats);

  if (loading) {
    return <LandingLoader />;
  }

  if (error) {
    console.error('Landing page error:', error);
    // Continue with static data even if API fails
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <Navigation 
        isMenuOpen={isMenuOpen}
        toggleMenu={toggleMenu}
        activeSection={activeSection}
      />

      {/* Main Content */}
      <main>
        <HeroSection stats={displayStats} />
        <AboutSection />
        <ServicesSection />
        <TestimonialsSection />
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

// Loading component
const LandingLoader = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-gray-600">Memuat halaman...</p>
    </div>
  </div>
);

export default Landing;