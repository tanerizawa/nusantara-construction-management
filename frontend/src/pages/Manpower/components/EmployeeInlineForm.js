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
    <tr className="bg-[#1C1C1E]/50 border-b-2 border-[#0A84FF]/20">
      <td colSpan="5" className="px-6 py-6">
        <div className="bg-[#2C2C2E] rounded-lg p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-[#38383A]">
            <div>
              <h3 className="text-lg font-semibold text-white">Add New Employee</h3>
              <p className="text-sm text-[#8E8E93] mt-1">Fill in employee information</p>
            </div>
            <button
              onClick={cancelForm}
              className="p-2 hover:bg-[#38383A] rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-[#8E8E93]" />
            </button>
          </div>

          {/* Employee Information */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-white flex items-center gap-2">
              <User className="h-4 w-4" />
              Employee Information
            </h4>
            
            <div className="grid grid-cols-3 gap-4">
              {/* Employee ID & Name */}
              <div>
                <label className="block text-xs font-medium text-[#8E8E93] mb-2">
                  Employee ID <span className="text-[#FF453A]">*</span>
                </label>
                <input
                  type="text"
                  name="employeeId"
                  value={employeeId}
                  onChange={handleInputChange}
                  placeholder="EMP-001"
                  required
                  className="w-full px-3 py-2 bg-[#1C1C1E] border border-[#38383A] rounded-lg text-sm text-white placeholder-[#636366] focus:ring-2 focus:ring-[#0A84FF] focus:border-transparent"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-xs font-medium text-[#8E8E93] mb-2">
                  Full Name <span className="text-[#FF453A]">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={name}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  required
                  className="w-full px-3 py-2 bg-[#1C1C1E] border border-[#38383A] rounded-lg text-sm text-white placeholder-[#636366] focus:ring-2 focus:ring-[#0A84FF] focus:border-transparent"
                />
              </div>

              {/* Position & Department */}
              <div>
                <label className="block text-xs font-medium text-[#8E8E93] mb-2">
                  Position <span className="text-[#FF453A]">*</span>
                </label>
                <select
                  name="position"
                  value={position}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 bg-[#1C1C1E] border border-[#38383A] rounded-lg text-sm text-white focus:ring-2 focus:ring-[#0A84FF] focus:border-transparent"
                >
                  <option value="">Select Position</option>
                  {POSITIONS.map(pos => (
                    <option key={pos} value={pos}>{pos}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#8E8E93] mb-2">
                  Department <span className="text-[#FF453A]">*</span>
                </label>
                <select
                  name="department"
                  value={department}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 bg-[#1C1C1E] border border-[#38383A] rounded-lg text-sm text-white focus:ring-2 focus:ring-[#0A84FF] focus:border-transparent"
                >
                  <option value="">Select Department</option>
                  {DEPARTMENTS.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#8E8E93] mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-[#1C1C1E] border border-[#38383A] rounded-lg text-sm text-white focus:ring-2 focus:ring-[#0A84FF] focus:border-transparent"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              {/* Email & Phone */}
              <div>
                <label className="block text-xs font-medium text-[#8E8E93] mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={handleInputChange}
                  placeholder="john@example.com"
                  className="w-full px-3 py-2 bg-[#1C1C1E] border border-[#38383A] rounded-lg text-sm text-white placeholder-[#636366] focus:ring-2 focus:ring-[#0A84FF] focus:border-transparent"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-xs font-medium text-[#8E8E93] mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={phone}
                  onChange={handleInputChange}
                  placeholder="+62 812 3456 7890"
                  className="w-full px-3 py-2 bg-[#1C1C1E] border border-[#38383A] rounded-lg text-sm text-white placeholder-[#636366] focus:ring-2 focus:ring-[#0A84FF] focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* User Account Creation Section */}
          <div className="space-y-4 pt-4 border-t border-[#38383A]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="createUserAccount"
                  checked={createUserAccount}
                  onChange={(e) => setCreateUserAccount(e.target.checked)}
                  className="w-5 h-5 rounded border-[#38383A] bg-[#1C1C1E] checked:bg-[#0A84FF]"
                />
                <label htmlFor="createUserAccount" className="cursor-pointer">
                  <div className="text-sm font-semibold text-white flex items-center gap-2">
                    <Shield className="h-4 w-4 text-[#0A84FF]" />
                    Create User Account for System Access
                  </div>
                  <div className="text-xs text-[#8E8E93] mt-0.5">
                    Employee will be able to log in to the system
                  </div>
                </label>
              </div>
            </div>

            {/* User Account Fields */}
            {createUserAccount && (
              <div className="space-y-4 p-4 bg-[#0A84FF]/10 border border-[#0A84FF]/20 rounded-lg animate-slideDown">
                <div className="flex items-start gap-2 text-xs text-[#0A84FF]">
                  <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium mb-1">System Access Credentials</div>
                    <div className="text-[#64B5F6]">
                      Create login credentials for this employee to access the system
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Username */}
                  <div>
                    <label className="block text-xs font-medium text-[#8E8E93] mb-2">
                      Username <span className="text-[#FF453A]">*</span>
                    </label>
                    <input
                      type="text"
                      value={userAccountData.username}
                      onChange={(e) => handleUserDataChange('username', e.target.value)}
                      placeholder="john.doe"
                      required={createUserAccount}
                      className="w-full px-3 py-2 bg-[#1C1C1E] border border-[#38383A] rounded-lg text-sm text-white placeholder-[#636366] focus:ring-2 focus:ring-[#0A84FF] focus:border-transparent"
                    />
                  </div>

                  {/* Role */}
                  <div>
                    <label className="block text-xs font-medium text-[#8E8E93] mb-2">
                      Role <span className="text-[#FF453A]">*</span>
                    </label>
                    <select
                      value={userAccountData.userRole}
                      onChange={(e) => handleUserDataChange('userRole', e.target.value)}
                      className="w-full px-3 py-2 bg-[#1C1C1E] border border-[#38383A] rounded-lg text-sm text-white focus:ring-2 focus:ring-[#0A84FF] focus:border-transparent"
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
                    <label className="block text-xs font-medium text-[#8E8E93] mb-2">
                      Password <span className="text-[#FF453A]">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={userAccountData.userPassword}
                        onChange={(e) => handleUserDataChange('userPassword', e.target.value)}
                        placeholder="Min. 8 characters"
                        required={createUserAccount}
                        className="w-full px-3 py-2 pr-10 bg-[#1C1C1E] border border-[#38383A] rounded-lg text-sm text-white placeholder-[#636366] focus:ring-2 focus:ring-[#0A84FF] focus:border-transparent"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8E8E93] hover:text-white"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {userAccountData.userPassword && userAccountData.userPassword.length < 8 && (
                      <p className="mt-1 text-xs text-[#FF453A]">Password must be at least 8 characters</p>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-xs font-medium text-[#8E8E93] mb-2">
                      Confirm Password <span className="text-[#FF453A]">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={userAccountData.confirmPassword}
                        onChange={(e) => handleUserDataChange('confirmPassword', e.target.value)}
                        placeholder="Confirm password"
                        required={createUserAccount}
                        className={`w-full px-3 py-2 pr-10 bg-[#1C1C1E] border ${!passwordMatch ? 'border-[#FF453A]' : 'border-[#38383A]'} rounded-lg text-sm text-white placeholder-[#636366] focus:ring-2 focus:ring-[#0A84FF] focus:border-transparent`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8E8E93] hover:text-white"
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {userAccountData.confirmPassword && (
                      <div className="mt-1 flex items-center gap-1 text-xs">
                        {passwordMatch ? (
                          <>
                            <CheckCircle className="h-3 w-3 text-[#30D158]" />
                            <span className="text-[#30D158]">Passwords match</span>
                          </>
                        ) : (
                          <>
                            <AlertCircle className="h-3 w-3 text-[#FF453A]" />
                            <span className="text-[#FF453A]">Passwords do not match</span>
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
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#38383A]">
            <button
              onClick={cancelForm}
              className="px-4 py-2 bg-[#38383A] text-white rounded-lg hover:bg-[#48484A] transition-colors text-sm font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitLoading || !isFormValid || !isUserAccountValid}
              className="px-4 py-2 bg-[#0A84FF] text-white rounded-lg hover:bg-[#0A84FF]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium flex items-center gap-2"
            >
              {submitLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/20 border-t-white"></div>
                  Creating...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4" />
                  Create Employee
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