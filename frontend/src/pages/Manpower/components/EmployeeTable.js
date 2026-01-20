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
    <tr className="border-b border-white/5 transition-colors duration-150 hover:bg-white/5">
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <div>
            <div className="font-medium text-white">{employee.name}</div>
            <div className="text-xs text-white/50 mt-0.5">{employee.employeeId}</div>
          </div>
          {employee.userId && (
            <div 
              className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#30D158]/20 text-[#30D158] rounded-lg text-xs"
              title={`Has user account: ${employee.userAccount?.username || 'linked'}`}
            >
              <Key className="h-3 w-3" />
              <span className="hidden sm:inline">Access</span>
            </div>
          )}
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="text-sm text-white">{employee.position}</div>
        <div className="text-xs text-white/50 mt-0.5">{employee.department}</div>
      </td>
      <td className="px-4 py-3">
        <div className="text-xs text-white/60">{employee.email || '-'}</div>
        <div className="text-xs text-white/50 mt-0.5">{employee.phone || '-'}</div>
      </td>
      <td className="px-4 py-3 text-center">
        <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full border ${getStatusColor(employee.status)}`}>
          {formatStatus(employee.status)}
        </span>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center justify-center gap-1">
          <button
            onClick={() => onViewDetail(employee)}
            className="p-1.5 text-[#0ea5e9] hover:bg-[#0ea5e9]/10 rounded-lg transition-colors"
            title="Lihat Detail"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(employee.id)}
            className="p-1.5 text-[#FF453A] hover:bg-[#FF453A]/10 rounded-lg transition-colors"
            title="Hapus"
          >
            <Trash2 className="h-4 w-4" />
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
      <Users className="h-12 w-12 text-white/30 mx-auto mb-3" />
      <p className="text-white/60">Tidak ada data karyawan</p>
      <p className="text-sm text-white/40 mt-1">Silakan tambahkan karyawan baru</p>
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
    <div className="overflow-hidden rounded-3xl border border-white/5 bg-[#070b13]/85 shadow-[0_25px_60px_rgba(0,0,0,0.45)]">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-white/5">
            <tr className="border-b border-white/10 text-white/60">
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-[0.2em] text-white/50">
                Karyawan
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-[0.2em] text-white/50">
                Posisi & Dept
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-[0.2em] text-white/50">
                Kontak
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-[0.2em] text-white/50 w-20">
                Status
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-[0.2em] text-white/50 w-20">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
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
