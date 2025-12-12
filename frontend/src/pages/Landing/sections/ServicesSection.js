import React from 'react';
import { SERVICES_DATA } from '../config/contentData';
import { useIntersectionObserver } from '../hooks/useLandingData';

export const ServicesSection = ({ className = '' }) => {
  const { elementRef, hasIntersected } = useIntersectionObserver();

  return (
    <section
      id="services"
      ref={elementRef}
      className={`relative py-20 bg-slate-950 text-white overflow-hidden ${className}`}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950" />
      <div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-blue-900/40 to-transparent blur-3xl" />
      <div className="absolute top-10 right-10 w-72 h-72 bg-indigo-500/25 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
        <div className="text-center mb-16">
          <p className="text-sm uppercase tracking-[0.45em] text-white/60 mb-4">Layanan Inti</p>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Layanan Kami</h2>
          <p className="text-lg text-white/70 max-w-3xl mx-auto leading-relaxed">
            Solusi konstruksi terpadu dengan pengawasan kualitas ketat, dukungan engineering lengkap,
            dan dukungan after-service untuk memastikan proyek berjalan presisi.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {SERVICES_DATA.map((service, index) => (
            <ServiceCard
              key={index}
              service={service}
              animated={hasIntersected}
              delay={index * 180}
            />
          ))}
        </div>

        <ServiceProcess />
      </div>
    </section>
  );
};

const ServiceCard = ({ service, animated, delay = 0 }) => {
  const IconComponent = service.icon;
  const fallbackSrc = service.image || '/images/services/sipil.svg';

  return (
    <div
      className={`bg-white/5 border border-white/10 rounded-3xl overflow-hidden shadow-2xl hover:shadow-blue-900/40 transition-all duration-500 transform hover:scale-[1.02] group backdrop-blur ${
        animated ? 'animate-fade-in-up' : 'opacity-0'
      }`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="relative h-48 bg-gradient-to-br from-blue-600 to-indigo-600 overflow-hidden">
        {(service.imageWebp || service.imageJpg || service.image) && (
          <picture>
            {service.imageWebp && <source srcSet={service.imageWebp} type="image/webp" />}
            {service.imageJpg && <source srcSet={service.imageJpg} type="image/jpeg" />}
            <img
              src={service.imageJpg || service.image}
              alt={`Layanan ${service.title}`}
              loading="lazy"
              decoding="async"
              onError={(e) => {
                if (e.currentTarget.dataset.fallbackApplied) return;
                e.currentTarget.dataset.fallbackApplied = 'true';
                e.currentTarget.src = fallbackSrc;
              }}
              className="absolute inset-0 w-full h-full object-cover opacity-80"
            />
          </picture>
        )}
        <div className="absolute inset-0 bg-slate-900/60"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <IconComponent
            size={64}
            className="text-white drop-shadow-md group-hover:scale-110 transition-transform duration-300"
          />
        </div>
      </div>

      <div className="p-8">
        <h3 className="text-2xl font-bold text-white mb-4">{service.title}</h3>

        <p className="text-white/70 leading-relaxed mb-6">{service.description}</p>

        <div className="space-y-3 mb-6">
          <div className="text-sm font-semibold text-white/70 tracking-wide uppercase mb-2">
            Spesialisasi
          </div>
          {service.projects.map((project, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-300 rounded-full"></div>
              <span className="text-sm text-white/70">{project}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between pt-6 border-t border-white/10">
          <ServiceStat label="Proyek" value={service.stats.projects} accent="text-blue-300" />
          <ServiceStat label="Pengalaman" value={service.stats.experience} accent="text-green-300" />
          <ServiceStat label="Sukses" value="100%" accent="text-purple-300" />
        </div>
      </div>
    </div>
  );
};

const ServiceStat = ({ label, value, accent }) => (
  <div className="text-center">
    <div className={`text-lg font-bold ${accent}`}>{value}</div>
    <div className="text-xs text-white/60 tracking-wide uppercase">{label}</div>
  </div>
);

const ServiceProcess = () => {
  const processSteps = [
    {
      step: '01',
      title: 'Konsultasi & Perencanaan',
      description: 'Analisis kebutuhan dan penyusunan rencana teknis terukur.'
    },
    {
      step: '02',
      title: 'Desain & Engineering',
      description: 'Perhitungan struktural dan desain detail lintas disiplin.'
    },
    {
      step: '03',
      title: 'Pelaksanaan Konstruksi',
      description: 'Eksekusi lapangan dengan pengawasan mutu dan keselamatan.'
    },
    {
      step: '04',
      title: 'Quality Control & Handover',
      description: 'Testing, dokumentasi, dan serah terima aset proyek.'
    }
  ];

  return (
    <div className="mt-20">
      <div className="text-center mb-12">
        <h3 className="text-3xl font-bold text-white mb-4">Proses Kerja Kami</h3>
        <p className="text-lg text-white/70">
          Metodologi yang terbukti untuk hasil yang optimal dan terdokumentasi.
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
    {index < 3 && (
      <div className="hidden lg:block absolute top-12 left-full w-8 h-0.5 bg-white/20 group-hover:bg-blue-400 transition-colors duration-300 z-0"></div>
    )}

    <div className="bg-white/5 border border-white/10 p-6 rounded-2xl shadow-lg hover:shadow-blue-900/30 transition-all duration-300 relative z-10 backdrop-blur">
      <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg mb-4 group-hover:scale-110 transition-transform duration-300">
        {step.step}
      </div>

      <h4 className="text-lg font-bold text-white mb-3">{step.title}</h4>

      <p className="text-white/70 text-sm leading-relaxed">{step.description}</p>
    </div>
  </div>
);

export default ServicesSection;
