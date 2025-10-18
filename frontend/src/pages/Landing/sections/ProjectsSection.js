import React from 'react';
import { Calendar, ChevronRight, CheckCircle, Clock } from 'lucide-react';
import { useIntersectionObserver } from '../hooks/useLandingData';

export const ProjectsSection = ({ projects = [], className = '' }) => {
  const { elementRef, hasIntersected } = useIntersectionObserver();

  return (
    <section id="projects" ref={elementRef} className={`py-20 bg-white ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Proyek Terbaru
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Sampel proyek aktif dan selesai sebagai bukti kualitas dan konsistensi kami
          </p>
        </div>

        {projects && projects.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((p, idx) => (
              <ProjectCard key={p.id || idx} project={p} animated={hasIntersected} delay={idx * 120} />)
            )}
          </div>
        ) : (
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-12 text-center">
            <p className="text-gray-600">Belum ada data proyek untuk ditampilkan.</p>
          </div>
        )}
      </div>
    </section>
  );
};

const ProjectCard = ({ project, animated, delay = 0 }) => {
  const isCompleted = project.status === 'completed';
  const statusColor = isCompleted ? 'text-green-600 bg-green-50' : 'text-blue-600 bg-blue-50';
  const StatusIcon = isCompleted ? CheckCircle : Clock;

  return (
    <div
      className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 transform hover:scale-[1.02] overflow-hidden ${
        animated ? 'animate-fade-in-up' : 'opacity-0'
      }`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-bold text-gray-900 line-clamp-2">{project.name || 'Proyek'}</h3>
          <span className={`ml-3 px-3 py-1 rounded-full text-xs font-semibold ${statusColor} whitespace-nowrap`}>
            <span className="inline-flex items-center">
              <StatusIcon size={14} className="mr-1" />
              {isCompleted ? 'Selesai' : 'Aktif'}
            </span>
          </span>
        </div>

        {project.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-3">{project.description}</p>
        )}

        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="inline-flex items-center">
            <Calendar size={16} className="mr-1" />
            {new Date(project.createdAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
          </div>
          {typeof project.progress === 'number' && (
            <div className="font-semibold text-gray-700">Progress: {project.progress}%</div>
          )}
        </div>
      </div>

      <div className="px-6 pb-6">
        <a
          href={`/projects/${project.id}`}
          className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700 transition-colors"
        >
          Lihat Detail
          <ChevronRight size={18} className="ml-1" />
        </a>
      </div>
    </div>
  );
};

export default ProjectsSection;

