import React from 'react';
import { ArrowRight, Play } from 'lucide-react';
import { COMPANY_STATS } from '../config/contentData';
import { THEME_CONFIG } from '../config/landingConfig';
import { useAnimatedCounter, useIntersectionObserver } from '../hooks/useLandingData';

export const StatsCard = ({ 
  stats = COMPANY_STATS, 
  className = '',
  animated = true 
}) => {
  const { elementRef, hasIntersected } = useIntersectionObserver();

  return (
    <div 
      ref={elementRef}
      className={`bg-white/90 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20 hover:shadow-3xl transition-all duration-500 transform hover:scale-105 ${className}`}
    >
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Pencapaian Kami</h3>
        <p className="text-gray-600">Rekam jejak yang membanggakan</p>
      </div>
      
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
  
  // Extract numeric value for animation
  const numericValue = typeof stat.number === 'string' 
    ? parseInt(stat.number.replace(/\D/g, '')) || 0
    : stat.number;
  
  const { currentValue } = useAnimatedCounter(
    numericValue, 
    2000, 
    animated
  );
  
  // Format the animated value back to string format
  const formatValue = (value) => {
    if (stat.number.includes('%')) return `${value}%`;
    if (stat.number.includes('+')) return `${value}+`;
    if (stat.number === 'A+') return value >= numericValue ? 'A+' : 'A';
    return value.toString();
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
        {animated ? formatValue(currentValue) : stat.number}
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

export const TrustBadges = ({ badges, className = '' }) => (
  <div className={`pt-8 ${className}`}>
    <p className="text-sm text-gray-500 mb-4 font-semibold">Dipercaya oleh:</p>
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {badges.map((badge, index) => (
        <div 
          key={index} 
          className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl py-3 px-4 text-center hover:shadow-lg transition-all duration-300 hover:scale-105 transform"
        >
          <div className="text-sm font-bold text-gray-700">{badge}</div>
        </div>
      ))}
    </div>
  </div>
);

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