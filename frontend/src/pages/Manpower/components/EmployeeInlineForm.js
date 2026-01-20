import React, { useState } from 'react';
import { X, Eye, EyeOff, Shield, User, CheckCircle, AlertCircle } from 'lucide-react';
import { DEPARTMENTS, POSITIONS } from '../utils';

/**
 * Employee inline form component with user account creation
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
  
  // User account creation states
  const [createUserAccount, setCreateUserAccount] = useState(false);
  const [userAccountData, setUserAccountData] = useState({
    username: '',
    userPassword: '',
    confirmPassword: '',
    userRole: 'supervisor'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(true);
  
  const isFormValid = employeeId && name && position && department;
  const isUserAccountValid = !createUserAccount || (
    userAccountData.username && 
    userAccountData.userPassword && 
    userAccountData.userPassword === userAccountData.confirmPassword &&
    userAccountData.userPassword.length >= 8
  );

  const handleUserDataChange = (field, value) => {
    const newData = { ...userAccountData, [field]: value };
    setUserAccountData(newData);
    
    // Check password match
    if (field === 'userPassword' || field === 'confirmPassword') {
      setPasswordMatch(
        newData.userPassword === newData.confirmPassword || 
        !newData.confirmPassword
      );
    }
  };

  const handleSubmit = () => {
    if (!isFormValid || !isUserAccountValid) return;
    
    const submitData = {
      ...formData,
      createUserAccount,
      ...(createUserAccount && {
        username: userAccountData.username,
        userPassword: userAccountData.userPassword,
        userRole: userAccountData.userRole
      })
    };
    
    handleSubmitEmployee(submitData);
  };
  
  return (
    <tr className="bg-[#0ea5e9]/5 border-b-2 border-[#0ea5e9]/20">
      <td colSpan="5" className="px-6 py-6">
        <div className="rounded-2xl border border-white/10 bg-[#0b0f19]/90 p-6 space-y-6 backdrop-blur-xl">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div>
              <h3 className="text-lg font-semibold text-white">Tambah Karyawan Baru</h3>
              <p className="text-sm text-white/50 mt-1">Isi informasi karyawan</p>
            </div>
            <button
              onClick={cancelForm}
              className="p-2 hover:bg-white/10 rounded-xl transition-colors"
            >
              <X className="h-5 w-5 text-white/60" />
            </button>
          </div>

          {/* Employee Information */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-white flex items-center gap-2">
              <User className="h-4 w-4" />
              Informasi Karyawan
            </h4>
            
            <div className="grid grid-cols-3 gap-4">
              {/* Employee ID & Name */}
              <div>
                <label className="block text-xs uppercase tracking-[0.2em] text-white/50 mb-2">
                  ID Karyawan <span className="text-[#FF453A]">*</span>
                </label>
                <input
                  type="text"
                  name="employeeId"
                  value={employeeId}
                  onChange={handleInputChange}
                  placeholder="EMP-001"
                  required
                  className="w-full px-3 py-2 rounded-2xl border border-white/10 bg-white/5 text-sm text-white placeholder-white/30 outline-none transition focus:border-[#0ea5e9]"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-xs uppercase tracking-[0.2em] text-white/50 mb-2">
                  Nama Lengkap <span className="text-[#FF453A]">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={name}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  required
                  className="w-full px-3 py-2 rounded-2xl border border-white/10 bg-white/5 text-sm text-white placeholder-white/30 outline-none transition focus:border-[#0ea5e9]"
                />
              </div>

              {/* Position & Department */}
              <div>
                <label className="block text-xs uppercase tracking-[0.2em] text-white/50 mb-2">
                  Posisi <span className="text-[#FF453A]">*</span>
                </label>
                <select
                  name="position"
                  value={position}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 rounded-2xl border border-white/10 bg-white/5 text-sm text-white outline-none transition focus:border-[#0ea5e9]"
                >
                  <option value="">Pilih Posisi</option>
                  {POSITIONS.map(pos => (
                    <option key={pos} value={pos}>{pos}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-[0.2em] text-white/50 mb-2">
                  Departemen <span className="text-[#FF453A]">*</span>
                </label>
                <select
                  name="department"
                  value={department}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 rounded-2xl border border-white/10 bg-white/5 text-sm text-white outline-none transition focus:border-[#0ea5e9]"
                >
                  <option value="">Pilih Departemen</option>
                  {DEPARTMENTS.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-[0.2em] text-white/50 mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded-2xl border border-white/10 bg-white/5 text-sm text-white outline-none transition focus:border-[#0ea5e9]"
                >
                  <option value="active">Aktif</option>
                  <option value="inactive">Non-Aktif</option>
                </select>
              </div>

              {/* Email & Phone */}
              <div>
                <label className="block text-xs uppercase tracking-[0.2em] text-white/50 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={handleInputChange}
                  placeholder="john@example.com"
                  className="w-full px-3 py-2 rounded-2xl border border-white/10 bg-white/5 text-sm text-white placeholder-white/30 outline-none transition focus:border-[#0ea5e9]"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-xs uppercase tracking-[0.2em] text-white/50 mb-2">
                  Telepon
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={phone}
                  onChange={handleInputChange}
                  placeholder="+62 812 3456 7890"
                  className="w-full px-3 py-2 rounded-2xl border border-white/10 bg-white/5 text-sm text-white placeholder-white/30 outline-none transition focus:border-[#0ea5e9]"
                />
              </div>
            </div>
          </div>

          {/* User Account Creation Section */}
          <div className="space-y-4 pt-4 border-t border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="createUserAccount"
                  checked={createUserAccount}
                  onChange={(e) => setCreateUserAccount(e.target.checked)}
                  className="w-5 h-5 rounded border-white/20 bg-white/5 checked:bg-[#0ea5e9]"
                />
                <label htmlFor="createUserAccount" className="cursor-pointer">
                  <div className="text-sm font-semibold text-white flex items-center gap-2">
                    <Shield className="h-4 w-4 text-[#0ea5e9]" />
                    Buat Akun User untuk Akses Sistem
                  </div>
                  <div className="text-xs text-white/50 mt-0.5">
                    Karyawan akan dapat login ke sistem
                  </div>
                </label>
              </div>
            </div>

            {/* User Account Fields */}
            {createUserAccount && (
              <div className="space-y-4 p-4 rounded-2xl bg-[#0ea5e9]/10 border border-[#0ea5e9]/20 animate-slideDown">
                <div className="flex items-start gap-2 text-xs text-[#0ea5e9]">
                  <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium mb-1">Kredensial Akses Sistem</div>
                    <div className="text-white/60">
                      Buat kredensial login untuk karyawan ini
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Username */}
                  <div>
                    <label className="block text-xs uppercase tracking-[0.2em] text-white/50 mb-2">
                      Username <span className="text-[#FF453A]">*</span>
                    </label>
                    <input
                      type="text"
                      value={userAccountData.username}
                      onChange={(e) => handleUserDataChange('username', e.target.value)}
                      placeholder="john.doe"
                      required={createUserAccount}
                      className="w-full px-3 py-2 rounded-2xl border border-white/10 bg-white/5 text-sm text-white placeholder-white/30 outline-none transition focus:border-[#0ea5e9]"
                    />
                  </div>

                  {/* Role */}
                  <div>
                    <label className="block text-xs uppercase tracking-[0.2em] text-white/50 mb-2">
                      Role <span className="text-[#FF453A]">*</span>
                    </label>
                    <select
                      value={userAccountData.userRole}
                      onChange={(e) => handleUserDataChange('userRole', e.target.value)}
                      className="w-full px-3 py-2 rounded-2xl border border-white/10 bg-white/5 text-sm text-white outline-none transition focus:border-[#0ea5e9]"
                    >
                      <option value="supervisor">Supervisor</option>
                      <option value="project_manager">Project Manager</option>
                      <option value="finance_manager">Finance Manager</option>
                      <option value="hr_manager">HR Manager</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-xs uppercase tracking-[0.2em] text-white/50 mb-2">
                      Password <span className="text-[#FF453A]">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={userAccountData.userPassword}
                        onChange={(e) => handleUserDataChange('userPassword', e.target.value)}
                        placeholder="Min. 8 karakter"
                        required={createUserAccount}
                        className="w-full px-3 py-2 pr-10 rounded-2xl border border-white/10 bg-white/5 text-sm text-white placeholder-white/30 outline-none transition focus:border-[#0ea5e9]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {userAccountData.userPassword && userAccountData.userPassword.length < 8 && (
                      <p className="mt-1 text-xs text-[#FF453A]">Password minimal 8 karakter</p>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-xs uppercase tracking-[0.2em] text-white/50 mb-2">
                      Konfirmasi Password <span className="text-[#FF453A]">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={userAccountData.confirmPassword}
                        onChange={(e) => handleUserDataChange('confirmPassword', e.target.value)}
                        placeholder="Konfirmasi password"
                        required={createUserAccount}
                        className={`w-full px-3 py-2 pr-10 rounded-2xl border ${!passwordMatch ? 'border-[#FF453A]' : 'border-white/10'} bg-white/5 text-sm text-white placeholder-white/30 outline-none transition focus:border-[#0ea5e9]`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {userAccountData.confirmPassword && (
                      <div className="mt-1 flex items-center gap-1 text-xs">
                        {passwordMatch ? (
                          <>
                            <CheckCircle className="h-3 w-3 text-[#30D158]" />
                            <span className="text-[#30D158]">Password cocok</span>
                          </>
                        ) : (
                          <>
                            <AlertCircle className="h-3 w-3 text-[#FF453A]" />
                            <span className="text-[#FF453A]">Password tidak cocok</span>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <button
              onClick={cancelForm}
              className="px-4 py-2 rounded-2xl border border-white/10 text-white/80 hover:bg-white/5 transition-colors text-sm font-medium"
            >
              Batal
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitLoading || !isFormValid || !isUserAccountValid}
              className="px-4 py-2 rounded-2xl bg-gradient-to-r from-[#0ea5e9] to-[#2563eb] text-white hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium flex items-center gap-2"
            >
              {submitLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/20 border-t-white"></div>
                  Menyimpan...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4" />
                  Simpan Karyawan
                </>
              )}
            </button>
          </div>
        </div>
      </td>
    </tr>
  );
};

export default EmployeeInlineForm;