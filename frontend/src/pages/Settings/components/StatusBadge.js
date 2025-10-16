import React from 'react';
import { CheckCircle, Clock } from 'lucide-react';

/**
 * Status badge component
 * 
 * @param {Object} props Component props
 * @param {string} props.status Status value
 * @returns {JSX.Element} Status badge UI
 */
const StatusBadge = ({ status }) => {
  switch (status) {
    case 'coming-soon':
      return (
        <span className="px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1" style={{
          backgroundColor: 'rgba(255, 159, 10, 0.1)',
          color: '#FF9F0A'
        }}>
          <Clock className="h-3 w-3" />
          Segera Hadir
        </span>
      );
    case 'available':
      return (
        <span className="px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1" style={{
          backgroundColor: 'rgba(48, 209, 88, 0.1)',
          color: '#30D158'
        }}>
          <CheckCircle className="h-3 w-3" />
          Tersedia
        </span>
      );
    default:
      return (
        <span className="px-3 py-1 rounded-full text-xs font-medium" style={{
          backgroundColor: 'rgba(152, 152, 157, 0.1)',
          color: '#98989D'
        }}>
          Dalam Pengembangan
        </span>
      );
  }
};

export default StatusBadge;