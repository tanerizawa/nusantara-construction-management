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
      color: '[#0A84FF]'
    },
    {
      title: 'Dalam Perencanaan',
      value: planning,
      icon: Clock,
      color: '[#FF9F0A]'
    },
    {
      title: 'Selesai',
      value: completed,
      icon: CheckCircle,
      color: '[#30D158]'
    },
    {
      title: 'Bermasalah',
      value: 0, // Placeholder value
      icon: AlertTriangle,
      color: '[#FF453A]'
    }
  ];
  
  return (
    <div className="mt-8 bg-[#2C2C2E] border border-[#38383A] p-6 rounded-xl hover:border-[#48484A] transition-colors">
      <h3 className="text-lg font-semibold text-white mb-4">Status Proyek</h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {statuses.map((status, index) => (
          <div key={index} className="text-center p-4 border border-[#38383A] rounded-lg hover:bg-[#3A3A3C] transition-colors">
            <status.icon className={`h-8 w-8 text-${status.color} mx-auto mb-2`} />
            <p className="text-2xl font-bold text-white">{status.value}</p>
            <p className="text-sm text-[#98989D]">{status.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectStatusOverview;