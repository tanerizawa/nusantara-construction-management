import React from 'react';
import { Target, Clock, CheckCircle, AlertTriangle } from 'lucide-react';

/**
 * Project status overview component
 * @param {Object} props Component props
 * @param {Object} props.projectData Project data
 * @returns {JSX.Element} Project status UI
 */
const ProjectStatusOverview = ({ projectData }) => {
  if (!projectData) return null;
  
  const { total, active, completed } = projectData;
  const planning = total - active - completed;
  
  const statuses = [
    {
      title: 'Proyek Aktif',
      value: active,
      icon: Target,
      colorClass: 'text-[#0A84FF]'
    },
    {
      title: 'Dalam Perencanaan',
      value: planning,
      icon: Clock,
      colorClass: 'text-[#FF9F0A]'
    },
    {
      title: 'Selesai',
      value: completed,
      icon: CheckCircle,
      colorClass: 'text-[#30D158]'
    },
    {
      title: 'Bermasalah',
      value: 0, // Placeholder value
      icon: AlertTriangle,
      colorClass: 'text-[#FF453A]'
    }
  ];
  
  return (
    <div className="mt-6 bg-[#2C2C2E] border border-[#38383A] p-5 rounded-xl hover:border-[#48484A] transition-colors">
      <h3 className="text-base font-semibold text-white mb-3">Status Proyek</h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {statuses.map((status, index) => (
          <div key={index} className="text-center p-3 border border-[#38383A] rounded-lg hover:bg-[#3A3A3C] transition-colors">
            <status.icon className={`h-6 w-6 ${status.colorClass} mx-auto mb-1.5`} />
            <p className="text-xl font-bold text-white">{status.value}</p>
            <p className="text-xs text-[#98989D]">{status.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectStatusOverview;
