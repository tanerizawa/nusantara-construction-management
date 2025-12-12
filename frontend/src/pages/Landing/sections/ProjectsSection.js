import React from 'react';
import { Calendar, CheckCircle, Clock } from 'lucide-react';
import { useIntersectionObserver } from '../hooks/useLandingData';

export const ProjectsSection = ({ projects = [], className = '' }) => {
  const { elementRef, hasIntersected } = useIntersectionObserver();

  return (
    <section
      id="projects"
      ref={elementRef}
      className={`relative py-20 bg-gradient-to-b from-white to-slate-50 ${className}`}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-white via-slate-50 to-slate-100" />
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
        <div className="text-center mb-16">
          <p className="text-sm uppercase tracking-[0.35em] text-blue-600 mb-4">Portofolio</p>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Proyek Terbaru
          </h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Sampel proyek aktif dan selesai sebagai bukti kualitas dan konsistensi kami.
          </p>
        </div>

        {projects && projects.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {projects.map((p, idx) => (
              <ProjectCard key={p.id || idx} project={p} animated={hasIntersected} delay={idx * 120} />)
            )}
          </div>
        ) : (
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-12 text-center border border-blue-100">
            <p className="text-slate-600">Belum ada data proyek untuk ditampilkan.</p>
          </div>
        )}

        <div className="mt-16 text-center">
          <a
            href="#contact"
            className="inline-flex items-center justify-center px-6 py-3 rounded-2xl bg-slate-900 text-white font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
          >
            Jadwalkan Konsultasi Proyek
          </a>
        </div>
      </div>
    </section>
  );
};

const ProjectCard = ({ project, animated, delay = 0 }) => {
  const isCompleted = project.status === 'completed';
  const statusColor = isCompleted ? 'text-green-600 bg-green-50' : 'text-blue-600 bg-blue-50';
  const StatusIcon = isCompleted ? CheckCircle : Clock;
  const fallbackSrc = project.image || '/images/projects/office-building.svg';

  // Format date safely
  const formatDate = (dateString) => {
    if (!dateString) return 'Tahun 2024';
    try {
      return new Date(dateString).toLocaleDateString('id-ID', { 
        day: '2-digit', 
        month: 'short', 
        year: 'numeric' 
      });
    } catch {
      return 'Tahun 2024';
    }
  };

  return (
    <div
      className={`bg-white border border-slate-100 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 overflow-hidden ${
        animated ? 'animate-fade-in-up' : 'opacity-0'
      }`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Project Image */}
      {(project.imageWebp || project.imageJpg || project.image) && (
        <div className="relative h-40 bg-gray-100 overflow-hidden">
          <picture>
            {project.imageWebp && <source srcSet={project.imageWebp} type="image/webp" />}
            {project.imageJpg && <source srcSet={project.imageJpg} type="image/jpeg" />}
            <img
              src={project.imageJpg || project.image}
              alt={`Proyek: ${project.name || 'Proyek'}`}
              loading="lazy"
              decoding="async"
              onError={(e) => {
                if (e.currentTarget.dataset.fallbackApplied) return;
                e.currentTarget.dataset.fallbackApplied = 'true';
                e.currentTarget.src = fallbackSrc;
              }}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </picture>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/35 to-transparent" />
        </div>
      )}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-bold text-slate-900 line-clamp-2">{project.name || 'Proyek'}</h3>
          <span className={`ml-3 px-3 py-1 rounded-full text-xs font-semibold ${statusColor} whitespace-nowrap`}>
            <span className="inline-flex items-center">
              <StatusIcon size={14} className="mr-1" />
              {isCompleted ? 'Selesai' : 'Aktif'}
            </span>
          </span>
        </div>

        {project.client && (
          <p className="text-slate-600 text-sm mb-2">
            <span className="font-semibold">Klien:</span> {project.client}
          </p>
        )}

        {project.location && (
          <p className="text-slate-500 text-sm mb-4">
            📍 {project.location}
          </p>
        )}

        <div className="flex items-center justify-between text-sm text-slate-500">
          <div className="inline-flex items-center">
            <Calendar size={16} className="mr-1" />
            {formatDate(project.createdAt)}
          </div>
          {project.value && (
            <div className="font-semibold text-slate-700">
              Rp {(project.value / 1000000000).toFixed(1)}M
            </div>
          )}
        </div>
      </div>

      {/* Remove link for showcase data */}
      <div className="px-6 pb-6">
        <div className="text-slate-400 text-sm italic">
          *Data sampel untuk showcase
        </div>
      </div>
    </div>
  );
};

export default ProjectsSection;
