import React from 'react';
import { Eye, Trash2, Users, Shield, Key } from 'lucide-react';
import { getStatusColor, formatStatus } from '../utils';

/**
 * Employee row component
 * @param {Object} props - Component props
 * @returns {JSX.Element} Employee row component
 */
const EmployeeRow = ({
  employee,
  onViewDetail,
  onDelete
}) => {
  return (
    <tr className="hover:bg-[#38383A]/30 transition-colors">
      <td className="px-3 py-3">
        <div className="flex items-center gap-2">
          <div>
            <div className="text-sm font-medium text-white">{employee.name}</div>
            <div className="text-xs text-[#636366] mt-0.5">{employee.employeeId}</div>
          </div>
          {employee.userId && (
            <div 
              className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#30D158]/20 text-[#30D158] rounded text-xs"
              title={`Has user account: ${employee.userAccount?.username || 'linked'}`}
            >
              <Key className="h-3 w-3" />
              <span className="hidden sm:inline">Access</span>
            </div>
          )}
        </div>
      </td>
      <td className="px-3 py-3">
        <div className="text-sm text-white">{employee.position}</div>
        <div className="text-xs text-[#98989D] mt-0.5">{employee.department}</div>
      </td>
      <td className="px-3 py-3">
        <div className="text-xs text-[#98989D]">{employee.email || '-'}</div>
        <div className="text-xs text-[#98989D] mt-0.5">{employee.phone || '-'}</div>
      </td>
      <td className="px-3 py-3 text-center">
        <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full border ${getStatusColor(employee.status)}`}>
          {formatStatus(employee.status)}
        </span>
      </td>
      <td className="px-3 py-3">
        <div className="flex items-center justify-center gap-1">
          <button
            onClick={() => onViewDetail(employee)}
            className="p-1 text-[#0A84FF] hover:bg-[#0A84FF]/10 rounded transition-colors"
            title="Lihat Detail"
          >
            <Eye className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => onDelete(employee.id)}
            className="p-1 text-[#FF453A] hover:bg-[#FF453A]/10 rounded transition-colors"
            title="Hapus"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </td>
    </tr>
  );
};

/**
 * Empty state component when no employees are found
 * @returns {JSX.Element} Empty state component
 */
const EmptyState = () => (
  <tr>
    <td colSpan="5" className="px-6 py-12 text-center">
      <Users className="h-12 w-12 text-[#636366] mx-auto mb-3" />
      <p className="text-[#98989D]">Tidak ada data karyawan</p>
      <p className="text-sm text-[#636366] mt-1">Silakan tambahkan karyawan baru</p>
    </td>
  </tr>
);

/**
 * Employee table component
 * @param {Object} props - Component props
 * @returns {JSX.Element} Employee table component
 */
const EmployeeTable = ({
  employees = [],
  isAddingInline = false,
  onViewDetail,
  onDelete,
  formComponent
}) => {
  return (
    <div className="bg-[#2C2C2E] rounded-xl shadow-sm border border-[#38383A] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#1C1C1E] border-b border-[#38383A]">
            <tr>
              <th className="px-3 py-3 text-left text-xs font-medium text-[#98989D] uppercase tracking-wider">
                Karyawan
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-[#98989D] uppercase tracking-wider">
                Posisi & Dept
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-[#98989D] uppercase tracking-wider">
                Kontak
              </th>
              <th className="px-3 py-3 text-center text-xs font-medium text-[#98989D] uppercase tracking-wider w-20">
                Status
              </th>
              <th className="px-3 py-3 text-center text-xs font-medium text-[#98989D] uppercase tracking-wider w-20">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#38383A]">
            {/* Inline Add Form */}
            {isAddingInline && formComponent}

            {/* Employee List or Empty State */}
            {employees.length === 0 && !isAddingInline ? (
              <EmptyState />
            ) : (
              employees.map((employee) => (
                <EmployeeRow
                  key={employee.id}
                  employee={employee}
                  onViewDetail={onViewDetail}
                  onDelete={onDelete}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeTable;
