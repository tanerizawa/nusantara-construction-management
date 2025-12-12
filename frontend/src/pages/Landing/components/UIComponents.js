import React from 'react';
import { ArrowRight, Play } from 'lucide-react';
import { COMPANY_STATS } from '../config/contentData';
import { useAnimatedCounter, useIntersectionObserver } from '../hooks/useLandingData';

export const StatsCard = ({ 
  stats = COMPANY_STATS, 
  className = '',
  animated = true,
  showHeader = false  // Add option to show/hide header
}) => {
  const { elementRef, hasIntersected } = useIntersectionObserver();

  return (
    <div 
      ref={elementRef}
      className={`bg-white/90 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20 hover:shadow-3xl transition-all duration-500 transform hover:scale-105 ${className}`}
    >
      {/* Header removed - cleaner design without "Pencapaian Kami" text */}
      {showHeader && (
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Statistik</h3>
          <p className="text-gray-600">Data perusahaan</p>
        </div>
      )}
      
      <div className="grid grid-cols-2 gap-6">
        {stats.map((stat, index) => (
          <StatItem 
            key={index} 
            stat={stat} 
            animated={animated && hasIntersected}
            delay={index * 200}
          />
        ))}
      </div>
    </div>
  );
};

const StatItem = ({ stat, animated, delay = 0 }) => {
  const IconComponent = stat.icon;
  
  // Extract numeric value for animation (integers only)
  const numericValue = typeof stat.number === 'string' 
    ? parseInt(stat.number.replace(/\D/g, '')) || 0
    : (Number.isFinite(stat.number) ? stat.number : 0);
  
  const { currentValue } = useAnimatedCounter(
    numericValue, 
    2000, 
    animated
  );
  
  // Format the animated value back to string format
  const formatValue = (value) => {
    const raw = stat.number;
    if (typeof raw !== 'string') return String(value);
    if (raw.includes('%')) return `${value}%`;
    if (raw.includes('+')) return `${value}+`;
    if (raw === 'A+') return value >= numericValue ? 'A+' : 'A';
    // Basic currency handling for strings like 'Rp 1.2M' or 'Rp 1000'
    if (raw.startsWith('Rp')) {
      // 'Rp 1.2M' → animate 0..12 then show (val/10).toFixed(1) + 'M'
      const hasMillion = /M\b/i.test(raw);
      if (hasMillion) {
        const millionVal = (value / 10).toFixed(1);
        return `Rp ${millionVal}M`;
      }
      // Plain number: 'Rp 1000'
      return `Rp ${value.toLocaleString('id-ID')}`;
    }
    return String(value);
  };

  return (
    <div 
      className="text-center group"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${stat.color} mb-4 group-hover:scale-110 transition-transform duration-300`}>
        <IconComponent size={28} className="text-white" />
      </div>
      
      <div className="text-3xl font-bold text-gray-900 mb-1">
        {animated ? formatValue(currentValue) : (typeof stat.number === 'string' ? stat.number : String(stat.number))}
      </div>
      
      <div className="text-sm font-semibold text-gray-700 mb-2">
        {stat.label}
      </div>
      
      <div className="text-xs text-gray-500 leading-relaxed">
        {stat.description}
      </div>
    </div>
  );
};

export const TrustBadges = ({ badges, className = '', variant = 'light' }) => {
  const isDark = variant === 'dark';
  return (
    <div className={`pt-8 ${className}`}>
      <p className={`text-sm mb-4 font-semibold ${isDark ? 'text-white/70' : 'text-gray-500'}`}>
        Dipercaya oleh:
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {badges.map((badge, index) => (
          <div 
            key={index} 
            className={`backdrop-blur-sm rounded-xl py-3 px-4 text-center hover:shadow-lg transition-all duration-300 hover:scale-105 transform ${
              isDark 
                ? 'bg-white/10 border border-white/15 text-white/80' 
                : 'bg-white/80 border border-gray-200 text-gray-700'
            }`}
          >
            <div className="text-sm font-bold">{badge}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const CTAButtons = ({ 
  primaryCTA, 
  secondaryCTA, 
  onPrimaryClick, 
  onSecondaryClick,
  className = '' 
}) => (
  <div className={`flex flex-col sm:flex-row gap-4 ${className}`}>
    <a 
      href={primaryCTA.href}
      onClick={onPrimaryClick}
      className={`group px-8 py-4 rounded-2xl transition-all duration-300 inline-flex items-center justify-center font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transform ${primaryCTA.className}`}
    >
      <span>{primaryCTA.text}</span>
      <ArrowRight size={24} className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
    </a>
    
    <a 
      href={secondaryCTA.href}
      onClick={onSecondaryClick}
      className={`group px-8 py-4 rounded-2xl transition-all duration-300 inline-flex items-center justify-center font-bold text-lg shadow-lg hover:shadow-xl ${secondaryCTA.className}`}
    >
      <Play size={20} className="mr-2" />
      <span>{secondaryCTA.text}</span>
    </a>
  </div>
);

export default { StatsCard, TrustBadges, CTAButtons };
