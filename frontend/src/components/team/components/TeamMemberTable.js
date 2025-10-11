import React from 'react';
import { Edit, Trash2, Mail, Phone, Award, Clock, DollarSign } from 'lucide-react';
import { formatCurrencyCompact } from '../../../utils/formatters';

/**
 * Dark themed table for team members
 * Compact and modern design
 */
const TeamMemberTable = ({ members, onEdit, onDelete }) => {
  if (members.length === 0) {
    return null;
  }

  const getStatusBadge = (status) => {
    const configs = {
      active: {
        bg: 'bg-[#30D158]/20',
        text: 'text-[#30D158]',
        label: 'Active'
      },
      inactive: {
        bg: 'bg-[#8E8E93]/20',
        text: 'text-[#8E8E93]',
        label: 'Inactive'
      },
      on_leave: {
        bg: 'bg-[#FFD60A]/20',
        text: 'text-[#FFD60A]',
        label: 'On Leave'
      }
    };

    const config = configs[status] || configs.active;

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  return (
    <div className="bg-gradient-to-br from-[#1C1C1E] to-[#2C2C2E] border border-[#38383A] rounded-xl overflow-hidden">
      {/* Table Container with Horizontal Scroll */}
      <div className="overflow-x-auto">
        <table className="w-full">
          {/* Table Header */}
          <thead className="bg-[#2C2C2E]/50 border-b border-[#38383A]">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-[#8E8E93] uppercase tracking-wider">
                Member
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-[#8E8E93] uppercase tracking-wider">
                Role
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-[#8E8E93] uppercase tracking-wider">
                Contact
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-[#8E8E93] uppercase tracking-wider">
                Allocation
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-[#8E8E93] uppercase tracking-wider">
                Rate/Hour
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-[#8E8E93] uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-[#8E8E93] uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-[#38383A]">
            {members.map((member) => (
              <tr 
                key={member.id}
                className="hover:bg-[#2C2C2E]/30 transition-colors"
              >
                {/* Member Info */}
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-[#0A84FF]/20 to-[#0A84FF]/10 rounded-lg flex items-center justify-center border border-[#0A84FF]/30">
                      <span className="text-[#0A84FF] font-semibold text-sm">
                        {member.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                      </span>
                    </div>
                    
                    {/* Name & ID */}
                    <div>
                      <div className="text-sm font-semibold text-white">
                        {member.name}
                      </div>
                      <div className="text-xs text-[#8E8E93]">
                        ID: {member.employeeId}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Role */}
                <td className="px-4 py-4">
                  <div className="text-sm text-white font-medium">
                    {member.role}
                  </div>
                  {member.skills && member.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {member.skills.slice(0, 2).map((skill, i) => (
                        <span 
                          key={i}
                          className="inline-flex px-1.5 py-0.5 bg-[#0A84FF]/10 text-[#0A84FF] text-xs rounded"
                        >
                          {skill}
                        </span>
                      ))}
                      {member.skills.length > 2 && (
                        <span className="text-xs text-[#8E8E93]">
                          +{member.skills.length - 2}
                        </span>
                      )}
                    </div>
                  )}
                </td>

                {/* Contact */}
                <td className="px-4 py-4">
                  <div className="space-y-1">
                    {member.email && (
                      <div className="flex items-center gap-1.5 text-xs text-[#8E8E93]">
                        <Mail size={12} />
                        <span className="truncate max-w-[180px]">{member.email}</span>
                      </div>
                    )}
                    {member.phone && (
                      <div className="flex items-center gap-1.5 text-xs text-[#8E8E93]">
                        <Phone size={12} />
                        <span>{member.phone}</span>
                      </div>
                    )}
                  </div>
                </td>

                {/* Allocation */}
                <td className="px-4 py-4 text-center">
                  <div className="inline-flex flex-col items-center">
                    <div className="text-sm font-semibold text-white">
                      {member.allocation}%
                    </div>
                    <div className="w-16 bg-[#38383A] rounded-full h-1.5 mt-1">
                      <div 
                        className="bg-[#0A84FF] h-1.5 rounded-full"
                        style={{ width: `${member.allocation}%` }}
                      />
                    </div>
                  </div>
                </td>

                {/* Hourly Rate */}
                <td className="px-4 py-4 text-right">
                  <div className="text-sm font-semibold text-white">
                    {formatCurrencyCompact(member.hourlyRate || 0)}
                  </div>
                  <div className="text-xs text-[#8E8E93]">
                    per jam
                  </div>
                </td>

                {/* Status */}
                <td className="px-4 py-4 text-center">
                  {getStatusBadge(member.status)}
                </td>

                {/* Actions */}
                <td className="px-4 py-4">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => onEdit(member)}
                      className="p-2 text-[#0A84FF] hover:bg-[#0A84FF]/10 rounded-lg transition-colors"
                      title="Edit member"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => onDelete(member.id)}
                      className="p-2 text-[#FF453A] hover:bg-[#FF453A]/10 rounded-lg transition-colors"
                      title="Delete member"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Table Footer with Summary */}
      <div className="bg-[#2C2C2E]/30 border-t border-[#38383A] px-4 py-3">
        <div className="flex items-center justify-between text-xs text-[#8E8E93]">
          <div>
            Total: <span className="text-white font-medium">{members.length}</span> member{members.length !== 1 ? 's' : ''}
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <Award size={14} className="text-[#30D158]" />
              <span>
                Active: <span className="text-white font-medium">
                  {members.filter(m => m.status === 'active').length}
                </span>
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock size={14} className="text-[#FFD60A]" />
              <span>
                Avg: <span className="text-white font-medium">
                  {members.length > 0 
                    ? Math.round(members.reduce((sum, m) => sum + (m.allocation || 0), 0) / members.length)
                    : 0
                  }%
                </span>
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <DollarSign size={14} className="text-[#BF5AF2]" />
              <span>
                Total Rate: <span className="text-white font-medium">
                  {formatCurrencyCompact(members.reduce((sum, m) => sum + (m.hourlyRate || 0), 0))}
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamMemberTable;
