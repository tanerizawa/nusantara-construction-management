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
      <div className="bg-[#2C2C2E] rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-[#38383A]">
        <div className="sticky top-0 bg-[#1C1C1E] border-b border-[#38383A] px-6 py-4 flex justify-between items-center">
          <h3 className="text-xl font-bold text-white">Detail Karyawan</h3>
          <button 
            onClick={onClose}
            className="text-[#636366] hover:text-white"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Profile Section */}
          <div className="flex items-start gap-4 pb-6 border-b border-[#38383A]">
            <div className="w-20 h-20 bg-[#0A84FF]/20 rounded-xl flex items-center justify-center">
              <Users className="h-10 w-10 text-[#0A84FF]" />
            </div>
            <div className="flex-1">
              <h4 className="text-2xl font-bold text-white">{employee.name}</h4>
              <p className="text-[#98989D] mt-1">{employee.position}</p>
              <span className={`inline-block mt-2 px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(employee.status)}`}>
                {formatStatus(employee.status)}
              </span>
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-[#98989D]">ID Karyawan</label>
              <p className="mt-1 text-white">{employee.employeeId}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-[#98989D]">Departemen</label>
              <p className="mt-1 text-white">{employee.department}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-[#98989D]">Email</label>
              <p className="mt-1 text-white">{employee.email || '-'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-[#98989D]">Telepon</label>
              <p className="mt-1 text-white">{employee.phone || '-'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-[#98989D]">Tanggal Bergabung</label>
              <p className="mt-1 text-white">{formatDate(employee.joinDate)}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-[#98989D]">Tipe Pekerjaan</label>
              <p className="mt-1 text-white capitalize">{employee.employmentType || '-'}</p>
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-[#98989D]">Gaji</label>
              <p className="mt-1 text-white">{formatCurrency(employee.salary)}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-6 border-t border-[#38383A]">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-[#38383A] text-white rounded-lg hover:bg-[#38383A]/70 transition-colors font-medium"
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