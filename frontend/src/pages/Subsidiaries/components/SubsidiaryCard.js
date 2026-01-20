import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  Users, 
  Calendar, 
  CheckCircle, 
  XCircle,
  Eye,
  Edit,
  Trash2 
} from 'lucide-react';
import { 
  SPECIALIZATION_LABELS, 
  formatYear, 
  formatEmployeeCount,
  getStatusConfig 
} from '../utils';

/**
 * Subsidiary card component for displaying each subsidiary
 * 
 * @param {Object} props Component props
 * @param {Object} props.subsidiary Subsidiary data
 * @param {Function} props.onDelete Delete handler
 * @returns {JSX.Element} Subsidiary card UI
 */
const SubsidiaryCard = ({ subsidiary, onDelete }) => {
  const navigate = useNavigate();
  const statusConfig = getStatusConfig(subsidiary.status);

  return (
    <div 
      className="rounded-3xl overflow-hidden border border-white/5 bg-[#070b13]/85 backdrop-blur-xl shadow-[0_25px_60px_rgba(0,0,0,0.45)] transition-all duration-300 hover:border-white/10 hover:shadow-[0_30px_70px_rgba(0,0,0,0.55)]"
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-semibold text-white">
              {subsidiary.name}
            </h3>
            <p className="text-sm mt-1 text-white/50">
              {subsidiary.code}
            </p>
          </div>
          
          {/* Status Badge */}
          <div 
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
              subsidiary.status === 'active' 
                ? 'bg-[#30D158]/20 border border-[#30D158]/30 text-[#30D158]'
                : 'bg-[#FF453A]/20 border border-[#FF453A]/30 text-[#FF453A]'
            }`}
          >
            {statusConfig.icon === 'CheckCircle' && <CheckCircle size={14} />}
            {statusConfig.icon === 'XCircle' && <XCircle size={14} />}
            <span>{statusConfig.label}</span>
          </div>
        </div>
        
        {/* Info Items */}
        <div className="space-y-3 mb-6">
          {subsidiary.specialization && (
            <div className="flex items-center gap-2">
              <MapPin size={16} className="text-white/40" />
              <span className="text-white/80">
                {SPECIALIZATION_LABELS[subsidiary.specialization] || subsidiary.specialization}
              </span>
            </div>
          )}
          
          {subsidiary.establishedYear && (
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-white/40" />
              <span className="text-white/80">{formatYear(subsidiary.establishedYear)}</span>
            </div>
          )}
          
          {subsidiary.employeeCount !== undefined && (
            <div className="flex items-center gap-2">
              <Users size={16} className="text-white/40" />
              <span className="text-white/80">{formatEmployeeCount(subsidiary.employeeCount)}</span>
            </div>
          )}
        </div>
        
        {/* Actions */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-white/5">
          <button
            onClick={() => navigate(`/subsidiaries/${subsidiary.id}`)}
            className="flex items-center justify-center flex-1 gap-2 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <Eye size={16} />
            Detail
          </button>
          <button
            onClick={() => navigate(`/subsidiaries/${subsidiary.id}/edit`)}
            className="flex items-center justify-center gap-2 p-2.5 rounded-xl border border-white/10 bg-white/5 text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => onDelete(subsidiary.id)}
            className="flex items-center justify-center gap-2 p-2.5 rounded-xl border border-[#FF453A]/30 bg-[#FF453A]/10 text-[#FF453A] hover:bg-[#FF453A]/20 transition-colors"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubsidiaryCard;