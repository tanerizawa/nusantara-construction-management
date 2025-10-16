import React from 'react';
import { X } from 'lucide-react';
import { DEPARTMENTS, POSITIONS } from '../utils';

/**
 * Employee inline form component
 * @param {Object} props - Component props
 * @returns {JSX.Element} Employee inline form component
 */
const EmployeeInlineForm = ({
  formData,
  handleInputChange,
  handleSubmitEmployee,
  submitLoading,
  cancelForm
}) => {
  const { employeeId, name, position, department, email, phone, status } = formData;
  
  const isFormValid = employeeId && name && position && department;
  
  return (
    <tr className="bg-[#1C1C1E]/50">
      <td className="px-3 py-3">
        <input
          type="text"
          name="employeeId"
          value={employeeId}
          onChange={handleInputChange}
          placeholder="ID: EMP-001"
          required
          className="w-full px-2 py-1 mb-1 bg-[#2C2C2E] border border-[#38383A] rounded text-xs text-white placeholder-[#636366] focus:ring-1 focus:ring-[#0A84FF] focus:border-transparent"
        />
        <input
          type="text"
          name="name"
          value={name}
          onChange={handleInputChange}
          placeholder="Nama Lengkap *"
          required
          className="w-full px-2 py-1 bg-[#2C2C2E] border border-[#38383A] rounded text-xs text-white placeholder-[#636366] focus:ring-1 focus:ring-[#0A84FF] focus:border-transparent"
        />
      </td>
      <td className="px-3 py-3">
        <select
          name="position"
          value={position}
          onChange={handleInputChange}
          required
          className="w-full px-2 py-1 mb-1 bg-[#2C2C2E] border border-[#38383A] rounded text-xs text-white focus:ring-1 focus:ring-[#0A84FF] focus:border-transparent"
        >
          <option value="">Pilih Posisi *</option>
          {POSITIONS.map(pos => (
            <option key={pos} value={pos}>{pos}</option>
          ))}
        </select>
        <select
          name="department"
          value={department}
          onChange={handleInputChange}
          required
          className="w-full px-2 py-1 bg-[#2C2C2E] border border-[#38383A] rounded text-xs text-white focus:ring-1 focus:ring-[#0A84FF] focus:border-transparent"
        >
          <option value="">Pilih Dept *</option>
          {DEPARTMENTS.map(dept => (
            <option key={dept} value={dept}>{dept}</option>
          ))}
        </select>
      </td>
      <td className="px-3 py-3">
        <input
          type="email"
          name="email"
          value={email}
          onChange={handleInputChange}
          placeholder="Email"
          className="w-full px-2 py-1 mb-1 bg-[#2C2C2E] border border-[#38383A] rounded text-xs text-white placeholder-[#636366] focus:ring-1 focus:ring-[#0A84FF] focus:border-transparent"
        />
        <input
          type="tel"
          name="phone"
          value={phone}
          onChange={handleInputChange}
          placeholder="Telepon"
          className="w-full px-2 py-1 bg-[#2C2C2E] border border-[#38383A] rounded text-xs text-white placeholder-[#636366] focus:ring-1 focus:ring-[#0A84FF] focus:border-transparent"
        />
      </td>
      <td className="px-3 py-3">
        <select
          name="status"
          value={status}
          onChange={handleInputChange}
          className="w-full px-2 py-1 bg-[#2C2C2E] border border-[#38383A] rounded text-xs text-white focus:ring-1 focus:ring-[#0A84FF] focus:border-transparent"
        >
          <option value="active">Aktif</option>
          <option value="inactive">Non-Aktif</option>
        </select>
      </td>
      <td className="px-3 py-3">
        <div className="flex items-center justify-center gap-1">
          <button
            onClick={handleSubmitEmployee}
            disabled={submitLoading || !isFormValid}
            className="p-1 bg-[#30D158] text-white rounded hover:bg-[#30D158]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Simpan"
          >
            {submitLoading ? (
              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
            ) : (
              <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>
          <button
            onClick={cancelForm}
            className="p-1 bg-[#FF453A] text-white rounded hover:bg-[#FF453A]/90 transition-colors"
            title="Batal"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default EmployeeInlineForm;