import React from 'react';
import { Building2, TrendingUp, Award, Users } from 'lucide-react';
import { TrustBadges, CTAButtons } from '../components/UIComponents';
import { LANDING_CONFIG, TRUST_BADGES } from '../config/landingConfig';
import { useCTAActions } from '../hooks/useInteractions';

export const HeroSection = ({ stats, className = '' }) => {
  const { ctaButtons } = LANDING_CONFIG;
  const { handleConsultationClick, handlePortfolioClick } = useCTAActions();

  return (
    <section
      id="home"
      className={`relative overflow-hidden min-h-screen bg-slate-950 text-white flex items-center pt-28 pb-16 ${className}`}
    >
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-900" />
        <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-blue-700/40 to-transparent blur-3xl" />
        <div className="absolute -bottom-32 -left-16 w-72 h-72 bg-blue-500/25 rounded-full blur-3xl" />
        <div className="absolute top-20 right-32 w-64 h-64 bg-indigo-500/30 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 w-full">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Hero Content */}
          <HeroContent 
            primaryCTA={ctaButtons.primary}
            secondaryCTA={ctaButtons.secondary}
            onPrimaryClick={handleConsultationClick}
            onSecondaryClick={handlePortfolioClick}
            stats={stats}
          />
          
          {/* Hero Image/Illustration */}
          <HeroVisual stats={stats} />
        </div>
      </div>
    </section>
  );
};

const HeroContent = ({ primaryCTA, secondaryCTA, onPrimaryClick, onSecondaryClick, stats }) => (
  <div className="text-left">
    {/* Hero Badge */}
    <div className="inline-flex items-center bg-white/10 border border-white/20 text-white/90 px-5 py-2 rounded-full font-semibold text-sm mb-6 backdrop-blur">
      <TrendingUp size={16} className="mr-2 text-amber-300" />
      Kontraktor Tepercaya di Karawang
    </div>
    
    {/* Hero Title */}
    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight tracking-tight">
      Membangun
      <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-sky-300 to-indigo-300">
        {" "}Infrastruktur{" "}
      </span>
      dengan Standar Premium
    </h1>
    
    {/* Hero Subtitle */}
    <p className="text-lg lg:text-xl text-white/80 leading-relaxed max-w-2xl mb-10">
      Perusahaan kontraktor profesional dengan <span className="font-bold text-white">15+ tahun pengalaman</span> 
      di Kabupaten Karawang. Kami memimpin proyek sipil, infrastruktur, dan bangunan gedung
      dengan pendekatan end-to-end serta pengawasan kualitas berlapis.
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
    <HeroStats stats={stats} />
    <TrustBadges badges={TRUST_BADGES} variant="dark" className="mt-10" />
  </div>
);

const HeroStats = ({ stats = [] }) => {
  const highlights = (stats || []).slice(0, 3);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-8">
      {highlights.map((stat, idx) => (
        <div
          key={stat.label || idx}
          className="bg-white/10 border border-white/15 rounded-2xl px-6 py-4 backdrop-blur flex flex-col"
        >
          <div className="text-3xl font-bold text-white">{stat.number}</div>
          <div className="text-sm font-semibold text-white/60 tracking-wide uppercase">
            {stat.label}
          </div>
          <p className="text-xs text-white/60 mt-1">{stat.description}</p>
        </div>
      ))}
    </div>
  );
};

// Hero Visual - Image with floating stats
const HeroVisual = ({ stats }) => (
  <div className="relative">
    <div className="absolute -inset-1 bg-gradient-to-br from-blue-500/60 to-indigo-500/60 blur-2xl opacity-50"></div>
    <div className="relative bg-slate-900/60 border border-white/10 rounded-[32px] shadow-2xl overflow-hidden aspect-square">
      {/* Hero image (Pexels-ready) with fallbacks */}
      <picture>
        <source srcSet="/images/hero/hero.webp" type="image/webp" />
        <source srcSet="/images/hero/hero.jpg" type="image/jpeg" />
        <img 
          src="/images/hero/hero.jpg"
          alt="Ilustrasi konstruksi dan infrastruktur"
          loading="eager"
          decoding="async"
          onError={(e) => {
            if (e.currentTarget.dataset.fallbackApplied) return;
            e.currentTarget.dataset.fallbackApplied = 'true';
            e.currentTarget.src = '/images/hero/hero-construction.svg';
          }}
          className="absolute inset-0 w-full h-full object-cover opacity-95"
        />
      </picture>
      {/* Light overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/50 to-transparent" />

      {/* Subtle decorative icon in background */}
      <div className="absolute inset-0 flex items-center justify-center p-12 pointer-events-none">
        <Building2 size={140} className="text-white/10" strokeWidth={1.5} />
      </div>

      {/* Floating stats badges */}
      <div className="absolute top-6 right-6 bg-white/95 rounded-2xl shadow-xl p-4 animate-float">
        <div className="text-3xl font-bold text-blue-600">{stats?.[0]?.number || '150+'}</div>
        <div className="text-xs text-gray-600 font-semibold">{stats?.[0]?.label || 'Proyek'}</div>
      </div>

      <div className="absolute bottom-6 left-6 bg-white/95 rounded-2xl shadow-xl p-4 animate-float-delayed">
        <div className="text-3xl font-bold text-green-600">{stats?.[2]?.number || '125+'}</div>
        <div className="text-xs text-gray-600 font-semibold">{stats?.[2]?.label || 'Selesai'}</div>
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
