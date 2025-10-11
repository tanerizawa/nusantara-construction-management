import React from 'react';
import { User, Edit, Trash2, Mail, Phone } from 'lucide-react';
import { formatCurrencyCompact } from '../../../utils/formatters';
import { STATUS_CONFIG } from '../config/rolesConfig';

const TeamMemberCard = ({ member, onEdit, onDelete }) => {
  const statusConfig = STATUS_CONFIG[member.status];

  return (
    <div className="bg-white rounded-lg border p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <User size={20} className="text-blue-600" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-sm">{member.name}</h4>
            <p className="text-blue-600 font-medium text-xs">{member.role}</p>
            <p className="text-xs text-gray-500">ID: {member.employeeId}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${statusConfig.className}`}>
            {statusConfig.label}
          </span>
          <button
            onClick={onEdit}
            className="text-blue-600 hover:text-blue-800 p-1"
          >
            <Edit size={14} />
          </button>
          <button
            onClick={onDelete}
            className="text-red-600 hover:text-red-800 p-1"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Contact Info */}
      <div className="grid grid-cols-2 gap-3 mb-3 text-xs">
        <div className="flex items-center gap-1.5 text-gray-600">
          <Mail size={12} />
          <span className="truncate">{member.email}</span>
        </div>
        <div className="flex items-center gap-1.5 text-gray-600">
          <Phone size={12} />
          <span>{member.phone}</span>
        </div>
      </div>

      {/* Performance and Allocation */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-600">Performance</span>
            <span className="font-medium">{member.performance}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div 
              className="bg-green-600 h-1.5 rounded-full"
              style={{ width: `${member.performance}%` }}
            />
          </div>
        </div>
        
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-600">Allocation</span>
            <span className="font-medium">{member.allocation}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div 
              className="bg-blue-600 h-1.5 rounded-full"
              style={{ width: `${member.allocation}%` }}
            />
          </div>
        </div>
      </div>

      {/* Cost and Hours */}
      <div className="grid grid-cols-2 gap-3 mb-3 text-xs">
        <div>
          <span className="text-gray-600">Total Hours:</span>
          <div className="font-semibold text-sm">{member.totalHours} jam</div>
        </div>
        <div>
          <span className="text-gray-600">Total Cost:</span>
          <div className="font-semibold text-sm">{formatCurrencyCompact(member.totalCost)}</div>
        </div>
      </div>

      {/* Skills */}
      {member.skills && member.skills.length > 0 && (
        <div className="mb-3">
          <h5 className="text-xs font-medium text-gray-900 mb-1.5">Skills:</h5>
          <div className="flex flex-wrap gap-1">
            {member.skills.map((skill, i) => (
              <span key={i} className="inline-flex px-1.5 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Responsibilities */}
      {member.responsibilities && member.responsibilities.length > 0 && (
        <div className="mb-3">
          <h5 className="text-xs font-medium text-gray-900 mb-1.5">Tanggung Jawab:</h5>
          <ul className="text-xs text-gray-600 space-y-1">
            {member.responsibilities.map((resp, i) => (
              <li key={i} className="flex items-start gap-1.5">
                <div className="w-1 h-1 bg-gray-400 rounded-full mt-1.5 flex-shrink-0" />
                {resp}
              </li>
            ))}
          </ul>
        </div>
      )}

      {member.notes && (
        <div className="mt-3 p-2 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-700">{member.notes}</p>
        </div>
      )}
    </div>
  );
};

export default TeamMemberCard;

