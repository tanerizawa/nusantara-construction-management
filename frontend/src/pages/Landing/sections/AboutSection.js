import React from 'react';
import { ABOUT_DATA, WHY_CHOOSE_US_DATA } from '../config/contentData';
import { useIntersectionObserver } from '../hooks/useLandingData';

export const AboutSection = ({ className = '' }) => {
  const { elementRef, hasIntersected } = useIntersectionObserver();

  return (
    <section 
      id="about" 
      ref={elementRef}
      className={`py-20 bg-white ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {ABOUT_DATA.title}
          </h2>
          <p className="text-xl text-blue-600 font-semibold mb-4">
            {ABOUT_DATA.subtitle}
          </p>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {ABOUT_DATA.description}
          </p>
        </div>

        {/* Values Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {ABOUT_DATA.values.map((value, index) => (
            <ValueCard 
              key={index} 
              value={value} 
              animated={hasIntersected}
              delay={index * 100}
            />
          ))}
        </div>

        {/* Why Choose Us */}
        <WhyChooseUsGrid />

        {/* Certifications */}
        <CertificationsSection />
      </div>
    </section>
  );
};

const ValueCard = ({ value, animated, delay = 0 }) => {
  const IconComponent = value.icon;
  
  return (
    <div 
      className={`bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-2xl text-center group hover:shadow-xl transition-all duration-500 transform ${
        animated ? 'animate-fade-in-up' : 'opacity-0'
      }`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
        <IconComponent size={32} className="text-white" />
      </div>
      
      <h3 className="text-xl font-bold text-gray-900 mb-3">
        {value.title}
      </h3>
      
      <p className="text-gray-600 leading-relaxed">
        {value.description}
      </p>
    </div>
  );
};

const WhyChooseUsGrid = () => (
  <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-3xl p-12 mb-16">
    <div className="text-center mb-12">
      <h3 className="text-3xl font-bold text-gray-900 mb-4">
        Mengapa Memilih Kami?
      </h3>
      <p className="text-lg text-gray-600">
        Keunggulan yang membuat kami berbeda dari yang lain
      </p>
    </div>
    
    <div className="grid md:grid-cols-2 gap-8">
      {WHY_CHOOSE_US_DATA.map((item, index) => (
        <WhyChooseUsCard key={index} item={item} />
      ))}
    </div>
  </div>
);

const WhyChooseUsCard = ({ item }) => {
  const IconComponent = item.icon;
  
  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group">
      <div className="flex items-start space-x-4">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-xl group-hover:scale-110 transition-transform duration-300">
          <IconComponent size={24} className="text-white" />
        </div>
        
        <div className="flex-1">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xl font-bold text-gray-900">
              {item.title}
            </h4>
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
              {item.stats}
            </span>
          </div>
          
          <p className="text-gray-600 leading-relaxed">
            {item.description}
          </p>
        </div>
      </div>
    </div>
  );
};

const CertificationsSection = () => (
  <div className="text-center">
    <h3 className="text-2xl font-bold text-gray-900 mb-8">
      Sertifikasi & Standar Kualitas
    </h3>
    
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
      {ABOUT_DATA.certifications.map((cert, index) => (
        <div 
          key={index}
          className="bg-white border-2 border-gray-100 p-6 rounded-xl hover:border-blue-300 hover:shadow-lg transition-all duration-300"
        >
          <div className="text-sm font-semibold text-gray-700 text-center">
            {cert}
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default AboutSection;