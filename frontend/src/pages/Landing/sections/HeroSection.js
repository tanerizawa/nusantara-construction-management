import React from 'react';
import { ArrowRight, Play } from 'lucide-react';
import { StatsCard, TrustBadges, CTAButtons } from '../components/UIComponents';
import { LANDING_CONFIG, TRUST_BADGES } from '../config/landingConfig';
import { useCTAActions } from '../hooks/useInteractions';

export const HeroSection = ({ stats, className = '' }) => {
  const { ctaButtons } = LANDING_CONFIG;
  const { handleConsultationClick, handlePortfolioClick } = useCTAActions();

  return (
    <section 
      id="home" 
      className={`min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center pt-20 ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Hero Content */}
          <HeroContent 
            primaryCTA={ctaButtons.primary}
            secondaryCTA={ctaButtons.secondary}
            onPrimaryClick={handleConsultationClick}
            onSecondaryClick={handlePortfolioClick}
          />
          
          {/* Hero Stats */}
          <div className="relative">
            <StatsCard stats={stats} />
          </div>
        </div>
      </div>
    </section>
  );
};

const HeroContent = ({ primaryCTA, secondaryCTA, onPrimaryClick, onSecondaryClick }) => (
  <div className="text-left">
    {/* Hero Badge */}
    <div className="inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full font-semibold text-sm mb-6">
      <span className="w-2 h-2 bg-blue-600 rounded-full mr-2 animate-pulse"></span>
      Kontraktor Terpercaya Karawang
    </div>
    
    {/* Hero Title */}
    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
      Membangun 
      <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
        {" "}Infrastruktur{" "}
      </span>
      Berkualitas Tinggi
    </h1>
    
    {/* Hero Subtitle */}
    <p className="text-xl lg:text-2xl text-gray-600 leading-relaxed max-w-2xl mb-8">
      Perusahaan kontraktor profesional dengan <span className="font-bold text-blue-600">15+ tahun pengalaman</span> 
      di Kabupaten Karawang. Spesialisasi konstruksi sipil, infrastruktur, dan bangunan gedung 
      dengan standar internasional.
    </p>
    
    {/* CTA Buttons */}
    <CTAButtons 
      primaryCTA={primaryCTA}
      secondaryCTA={secondaryCTA}
      onPrimaryClick={onPrimaryClick}
      onSecondaryClick={onSecondaryClick}
      className="mb-12"
    />

    {/* Trust Badges */}
    <TrustBadges badges={TRUST_BADGES} />
  </div>
);

export default HeroSection;