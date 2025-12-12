import React from 'react';
import { ABOUT_DATA, WHY_CHOOSE_US_DATA } from '../config/contentData';
import { useIntersectionObserver } from '../hooks/useLandingData';

export const AboutSection = ({ className = '' }) => {
  const { elementRef, hasIntersected } = useIntersectionObserver();

  return (
    <section
      id="about"
      ref={elementRef}
      className={`relative py-20 bg-white overflow-hidden ${className}`}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-white via-slate-50 to-white" />
      <div className="absolute top-16 left-10 w-64 h-64 bg-blue-200/30 rounded-full blur-3xl" />
      <div className="absolute -bottom-10 right-12 w-72 h-72 bg-indigo-100/40 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            {ABOUT_DATA.title}
          </h2>
          <p className="text-xl text-blue-600 font-semibold mb-4">
            {ABOUT_DATA.subtitle}
          </p>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
            {ABOUT_DATA.description}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-16">
          {ABOUT_DATA.values.map((value, index) => (
            <ValueCard
              key={index}
              value={value}
              animated={hasIntersected}
              delay={index * 120}
            />
          ))}
        </div>

        <WhyChooseUsGrid />
        <CertificationsSection />
      </div>
    </section>
  );
};

const ValueCard = ({ value, animated, delay = 0 }) => {
  const IconComponent = value.icon;

  return (
    <div
      className={`bg-white/90 border border-slate-100 p-8 rounded-2xl text-center group shadow-lg hover:shadow-xl transition-all duration-500 transform ${
        animated ? 'animate-fade-in-up' : 'opacity-0'
      }`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-blue-500/30 shadow-lg">
        <IconComponent size={32} className="text-white" />
      </div>

      <h3 className="text-xl font-bold text-slate-900 mb-3">
        {value.title}
      </h3>

      <p className="text-slate-600 leading-relaxed">
        {value.description}
      </p>
    </div>
  );
};

const WhyChooseUsGrid = () => (
  <div className="bg-white/85 border border-slate-100 rounded-3xl p-12 mb-16 shadow-xl backdrop-blur">
    <div className="text-center mb-12">
      <h3 className="text-3xl font-bold text-slate-900 mb-4">
        Mengapa Memilih Kami?
      </h3>
      <p className="text-lg text-slate-600">
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
    <div className="bg-gradient-to-br from-white to-slate-50 p-8 rounded-2xl shadow-lg hover:shadow-xl border border-slate-100 transition-all duration-300 group">
      <div className="flex items-start space-x-4">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-xl group-hover:scale-110 transition-transform duration-300 shadow-blue-500/40 shadow-lg">
          <IconComponent size={24} className="text-white" />
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xl font-bold text-slate-900">{item.title}</h4>
            <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold border border-blue-100">
              {item.stats}
            </span>
          </div>

          <p className="text-slate-600 leading-relaxed">{item.description}</p>
        </div>
      </div>
    </div>
  );
};

const CertificationsSection = () => (
  <div className="text-center">
    <h3 className="text-2xl font-bold text-slate-900 mb-8">
      Sertifikasi & Standar Kualitas
    </h3>

    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
      {ABOUT_DATA.certifications.map((cert, index) => (
        <div
          key={index}
          className="bg-white/90 border border-slate-100 p-6 rounded-xl hover:border-blue-200 hover:shadow-lg transition-all duration-300 shadow-sm"
        >
          <div className="text-sm font-semibold text-slate-700 text-center">
            {cert}
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default AboutSection;
