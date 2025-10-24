import React from 'react';
import { ArrowRight, Play, Building2, TrendingUp, Award, Users } from 'lucide-react';
import { TrustBadges, CTAButtons } from '../components/UIComponents';
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
          
          {/* Hero Image/Illustration */}
          <HeroVisual stats={stats} />
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

// Hero Visual - Modern illustration with floating stats
const HeroVisual = ({ stats }) => (
  <div className="relative">
    {/* Main illustration container */}
    <div className="relative bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl shadow-2xl overflow-hidden aspect-square">
      {/* Construction illustration using icons */}
      <div className="absolute inset-0 flex items-center justify-center p-12">
        <div className="grid grid-cols-2 gap-8 w-full">
          {/* Building icon - large */}
          <div className="col-span-2 flex items-center justify-center">
            <div className="relative">
              <Building2 size={120} className="text-white/20" strokeWidth={1.5} />
              <div className="absolute inset-0 flex items-center justify-center">
                <Building2 size={80} className="text-white animate-pulse" strokeWidth={2} />
              </div>
            </div>
          </div>
          
          {/* Decorative icons */}
          <div className="flex items-center justify-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 transform hover:scale-110 transition-transform duration-300">
              <TrendingUp size={40} className="text-white" strokeWidth={2} />
            </div>
          </div>
          
          <div className="flex items-center justify-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 transform hover:scale-110 transition-transform duration-300">
              <Award size={40} className="text-white" strokeWidth={2} />
            </div>
          </div>
        </div>
      </div>

      {/* Floating stats badges */}
      <div className="absolute top-6 right-6 bg-white rounded-2xl shadow-xl p-4 animate-float">
        <div className="text-3xl font-bold text-blue-600">{stats[0]?.number || '150+'}</div>
        <div className="text-xs text-gray-600 font-semibold">{stats[0]?.label || 'Proyek'}</div>
      </div>

      <div className="absolute bottom-6 left-6 bg-white rounded-2xl shadow-xl p-4 animate-float-delayed">
        <div className="text-3xl font-bold text-green-600">{stats[2]?.number || '125+'}</div>
        <div className="text-xs text-gray-600 font-semibold">{stats[2]?.label || 'Selesai'}</div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-1/4 left-0 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-0 w-40 h-40 bg-indigo-400/20 rounded-full blur-3xl"></div>
    </div>

    {/* Additional floating stat */}
    <div className="absolute -bottom-6 -right-6 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl shadow-2xl p-6 animate-float">
      <div className="flex items-center gap-3">
        <Users size={32} className="text-white" />
        <div>
          <div className="text-2xl font-bold text-white">15+</div>
          <div className="text-xs text-white/90 font-semibold">Tahun</div>
        </div>
      </div>
    </div>
  </div>
);

export default HeroSection;