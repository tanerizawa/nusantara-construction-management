import React from 'react';
import { X, Users } from 'lucide-react';
import { getStatusColor, formatStatus, formatCurrency, formatDate } from '../utils';

/**
 * Employee detail modal component
 * @param {Object} props - Component props
 * @returns {JSX.Element|null} Modal component or null if not visible
 */
const EmployeeDetailModal = ({ isOpen, employee, onClose }) => {
  if (!isOpen || !employee) return null;
  
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="rounded-3xl border border-white/10 bg-[#0b0f19]/95 shadow-[0_25px_60px_rgba(0,0,0,0.65)] backdrop-blur-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-[#0b0f19]/95 border-b border-white/10 px-6 py-4 flex justify-between items-center backdrop-blur-xl rounded-t-3xl">
          <h3 className="text-xl font-bold text-white">Detail Karyawan</h3>
          <button 
            onClick={onClose}
            className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Profile Section */}
          <div className="flex items-start gap-4 pb-6 border-b border-white/10">
            <div className="w-20 h-20 bg-[#0ea5e9]/20 rounded-2xl flex items-center justify-center">
              <Users className="h-10 w-10 text-[#0ea5e9]" />
            </div>
            <div className="flex-1">
              <h4 className="text-2xl font-bold text-white">{employee.name}</h4>
              <p className="text-white/60 mt-1">{employee.position}</p>
              <span className={`inline-block mt-2 px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(employee.status)}`}>
                {formatStatus(employee.status)}
              </span>
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-xs uppercase tracking-[0.2em] text-white/50">ID Karyawan</label>
              <p className="mt-1 text-white">{employee.employeeId}</p>
            </div>
            <div>
              <label className="text-xs uppercase tracking-[0.2em] text-white/50">Departemen</label>
              <p className="mt-1 text-white">{employee.department}</p>
            </div>
            <div>
              <label className="text-xs uppercase tracking-[0.2em] text-white/50">Email</label>
              <p className="mt-1 text-white">{employee.email || '-'}</p>
            </div>
            <div>
              <label className="text-xs uppercase tracking-[0.2em] text-white/50">Telepon</label>
              <p className="mt-1 text-white">{employee.phone || '-'}</p>
            </div>
            <div>
              <label className="text-xs uppercase tracking-[0.2em] text-white/50">Tanggal Bergabung</label>
              <p className="mt-1 text-white">{formatDate(employee.joinDate)}</p>
            </div>
            <div>
              <label className="text-xs uppercase tracking-[0.2em] text-white/50">Tipe Pekerjaan</label>
              <p className="mt-1 text-white capitalize">{employee.employmentType || '-'}</p>
            </div>
            <div className="md:col-span-2">
              <label className="text-xs uppercase tracking-[0.2em] text-white/50">Gaji</label>
              <p className="mt-1 text-white">{formatCurrency(employee.salary)}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-6 border-t border-white/10">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-2xl border border-white/10 text-white/80 hover:bg-white/5 transition-colors font-medium"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetailModal;