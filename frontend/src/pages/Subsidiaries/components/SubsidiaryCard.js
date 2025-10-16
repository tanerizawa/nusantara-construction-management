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
      className="rounded-xl overflow-hidden shadow-sm"
      style={{ backgroundColor: "#2C2C2E", border: "1px solid #38383A" }}
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-semibold" style={{ color: "#FFFFFF" }}>
              {subsidiary.name}
            </h3>
            <p className="text-sm mt-1" style={{ color: "#98989D" }}>
              {subsidiary.code}
            </p>
          </div>
          
          {/* Status Badge */}
          <div 
            className="flex items-center gap-1.5 px-3 py-1 rounded-full"
            style={{ 
              backgroundColor: statusConfig.bgColor,
              border: `1px solid ${statusConfig.borderColor}`,
              color: statusConfig.textColor
            }}
          >
            {statusConfig.icon === 'CheckCircle' && <CheckCircle size={14} />}
            {statusConfig.icon === 'XCircle' && <XCircle size={14} />}
            <span className="text-xs font-medium">{statusConfig.label}</span>
          </div>
        </div>
        
        {/* Info Items */}
        <div className="space-y-3 mb-6">
          {subsidiary.specialization && (
            <div className="flex items-center gap-2">
              <MapPin size={16} style={{ color: "#98989D" }} />
              <span style={{ color: "#FFFFFF" }}>
                {SPECIALIZATION_LABELS[subsidiary.specialization] || subsidiary.specialization}
              </span>
            </div>
          )}
          
          {subsidiary.establishedYear && (
            <div className="flex items-center gap-2">
              <Calendar size={16} style={{ color: "#98989D" }} />
              <span style={{ color: "#FFFFFF" }}>{formatYear(subsidiary.establishedYear)}</span>
            </div>
          )}
          
          {subsidiary.employeeCount !== undefined && (
            <div className="flex items-center gap-2">
              <Users size={16} style={{ color: "#98989D" }} />
              <span style={{ color: "#FFFFFF" }}>{formatEmployeeCount(subsidiary.employeeCount)}</span>
            </div>
          )}
        </div>
        
        {/* Actions */}
        <div className="flex items-center gap-2 mt-6 pt-4" style={{ borderTop: "1px solid #38383A" }}>
          <button
            onClick={() => navigate(`/subsidiaries/${subsidiary.id}`)}
            className="flex items-center justify-center flex-1 gap-2 py-2 rounded-lg transition-colors"
            style={{ backgroundColor: "#38383A", color: "#FFFFFF" }}
          >
            <Eye size={16} />
            Detail
          </button>
          <button
            onClick={() => navigate(`/subsidiaries/${subsidiary.id}/edit`)}
            className="flex items-center justify-center gap-2 p-2 rounded-lg transition-colors"
            style={{ backgroundColor: "#38383A", color: "#FFFFFF" }}
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => onDelete(subsidiary.id)}
            className="flex items-center justify-center gap-2 p-2 rounded-lg transition-colors"
            style={{ backgroundColor: "rgba(255, 69, 58, 0.2)", color: "#FF453A", border: "1px solid rgba(255, 69, 58, 0.3)" }}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubsidiaryCard;