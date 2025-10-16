import React from 'react';
import { SERVICES_DATA } from '../config/contentData';
import { useIntersectionObserver } from '../hooks/useLandingData';

export const ServicesSection = ({ className = '' }) => {
  const { elementRef, hasIntersected } = useIntersectionObserver();

  return (
    <section 
      id="services" 
      ref={elementRef}
      className={`py-20 bg-gradient-to-br from-gray-50 to-blue-50 ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Layanan Kami
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Menyediakan solusi konstruksi terpadu dengan teknologi modern dan 
            standar internasional untuk berbagai kebutuhan infrastruktur
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {SERVICES_DATA.map((service, index) => (
            <ServiceCard 
              key={index} 
              service={service} 
              animated={hasIntersected}
              delay={index * 200}
            />
          ))}
        </div>

        {/* Service Process */}
        <ServiceProcess />
      </div>
    </section>
  );
};

const ServiceCard = ({ service, animated, delay = 0 }) => {
  const IconComponent = service.icon;
  
  return (
    <div 
      className={`bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 group ${
        animated ? 'animate-fade-in-up' : 'opacity-0'
      }`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Service Image */}
      <div className="relative h-48 bg-gradient-to-br from-blue-600 to-indigo-600 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <IconComponent size={64} className="text-white group-hover:scale-110 transition-transform duration-300" />
        </div>
        
        {/* Stats Badge */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
          <div className="text-sm font-semibold text-gray-900">
            {service.stats.projects}
          </div>
          <div className="text-xs text-gray-600">
            Projects
          </div>
        </div>
      </div>

      {/* Service Content */}
      <div className="p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          {service.title}
        </h3>
        
        <p className="text-gray-600 leading-relaxed mb-6">
          {service.description}
        </p>

        {/* Service Projects */}
        <div className="space-y-3 mb-6">
          <div className="text-sm font-semibold text-gray-900 mb-2">
            Spesialisasi:
          </div>
          {service.projects.map((project, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              <span className="text-sm text-gray-700">{project}</span>
            </div>
          ))}
        </div>

        {/* Service Stats */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-100">
          <div className="text-center">
            <div className="text-lg font-bold text-blue-600">
              {service.stats.projects}
            </div>
            <div className="text-xs text-gray-500">Proyek</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-green-600">
              {service.stats.experience}
            </div>
            <div className="text-xs text-gray-500">Pengalaman</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-purple-600">100%</div>
            <div className="text-xs text-gray-500">Sukses</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ServiceProcess = () => {
  const processSteps = [
    {
      step: '01',
      title: 'Konsultasi & Perencanaan',
      description: 'Analisis kebutuhan dan penyusunan rencana teknis yang detail'
    },
    {
      step: '02', 
      title: 'Desain & Engineering',
      description: 'Pembuatan desain teknis dan kalkulasi struktural yang akurat'
    },
    {
      step: '03',
      title: 'Pelaksanaan Konstruksi', 
      description: 'Eksekusi pembangunan dengan pengawasan ketat dan kontrol kualitas'
    },
    {
      step: '04',
      title: 'Quality Control & Handover',
      description: 'Pemeriksaan final, testing, dan serah terima proyek'
    }
  ];

  return (
    <div className="mt-20">
      <div className="text-center mb-12">
        <h3 className="text-3xl font-bold text-gray-900 mb-4">
          Proses Kerja Kami
        </h3>
        <p className="text-lg text-gray-600">
          Metodologi yang terbukti untuk hasil yang optimal
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {processSteps.map((step, index) => (
          <ProcessCard key={index} step={step} index={index} />
        ))}
      </div>
    </div>
  );
};

const ProcessCard = ({ step, index }) => (
  <div className="relative group">
    {/* Connection Line */}
    {index < 3 && (
      <div className="hidden lg:block absolute top-12 left-full w-8 h-0.5 bg-gray-300 group-hover:bg-blue-600 transition-colors duration-300 z-0"></div>
    )}
    
    <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 relative z-10">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg mb-4 group-hover:scale-110 transition-transform duration-300">
        {step.step}
      </div>
      
      <h4 className="text-lg font-bold text-gray-900 mb-3">
        {step.title}
      </h4>
      
      <p className="text-gray-600 text-sm leading-relaxed">
        {step.description}
      </p>
    </div>
  </div>
);

export default ServicesSection;