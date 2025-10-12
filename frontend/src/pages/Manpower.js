import React, { useState, useEffect } from 'react';
import {
  Search, Plus, Eye, Users, UserCheck, Calendar, 
  Mail, Phone, X, UserPlus, Trash2, Filter
} from 'lucide-react';
import { employeeAPI } from '../services/api';

// Constants
const DEPARTMENTS = [
  'Construction', 'Engineering', 'Project Management', 'Finance',
  'Human Resources', 'Safety & HSE', 'Quality Control', 'Administration'
];

const POSITIONS = [
  'Project Manager', 'Site Manager', 'Civil Engineer', 'Mechanical Engineer',
  'Electrical Engineer', 'Architect', 'Quantity Surveyor', 'Safety Officer',
  'Foreman', 'Site Supervisor', 'Admin Staff', 'HR Staff'
];

const EMPLOYMENT_TYPES = ['permanent', 'contract', 'intern'];
const STATUS_OPTIONS = ['active', 'inactive', 'terminated'];

const Manpower = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [error, setError] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  
  const [formData, setFormData] = useState({
    employeeId: '',
    name: '',
    position: '',
    department: '',
    email: '',
    phone: '',
    joinDate: new Date().toISOString().split('T')[0],
    birthDate: '',
    employmentType: 'permanent',
    status: 'active',
    salary: ''
  });

  const resetForm = () => {
    setFormData({
      employeeId: '',
      name: '',
      position: '',
      department: '',
      email: '',
      phone: '',
      joinDate: new Date().toISOString().split('T')[0],
      birthDate: '',
      employmentType: 'permanent',
      status: 'active',
      salary: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitEmployee = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    
    try {
      const payload = {
        ...formData,
        salary: formData.salary ? parseFloat(formData.salary) : undefined
      };

      const result = await employeeAPI.create(payload);

      if (result.success) {
        const updatedResponse = await employeeAPI.getAll();
        const employeeData = updatedResponse.data || updatedResponse;
        setEmployees(Array.isArray(employeeData) ? employeeData : []);
        
        resetForm();
        setShowAddForm(false);
        setError(null);
      } else {
        throw new Error(result.error || 'Failed to create employee');
      }
    } catch (error) {
      console.error('Error creating employee:', error);
      setError(error.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDeleteEmployee = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus karyawan ini?')) return;
    
    try {
      await employeeAPI.delete(id);
      const updatedResponse = await employeeAPI.getAll();
      const employeeData = updatedResponse.data || updatedResponse;
      setEmployees(Array.isArray(employeeData) ? employeeData : []);
      setError(null);
    } catch (error) {
      console.error('Error deleting employee:', error);
      setError(error.message);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const employeeResponse = await employeeAPI.getAll();
        const employeeData = employeeResponse.data || employeeResponse;
        setEmployees(Array.isArray(employeeData) ? employeeData : []);
        
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message || 'Failed to fetch data');
        setEmployees([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-[#30D158]/20 text-[#30D158] border-[#30D158]/30';
      case 'inactive': return 'bg-[#98989D]/20 text-[#98989D] border-[#98989D]/30';
      case 'terminated': return 'bg-[#FF453A]/20 text-[#FF453A] border-[#FF453A]/30';
      default: return 'bg-[#98989D]/20 text-[#98989D] border-[#98989D]/30';
    }
  };

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         emp.employeeId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         emp.position?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = departmentFilter === '' || emp.department === departmentFilter;
    const matchesStatus = statusFilter === '' || emp.status === statusFilter;
    
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const stats = {
    total: employees.length,
    active: employees.filter(e => e.status === 'active').length,
    inactive: employees.filter(e => e.status === 'inactive').length,
    departments: [...new Set(employees.map(e => e.department))].length
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#1C1C1E]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0A84FF]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1C1C1E] p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="bg-[#2C2C2E] rounded-xl shadow-sm border border-[#38383A] p-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-white">Manpower Management</h1>
              <p className="text-[#98989D] mt-2">Kelola data karyawan dan personil proyek</p>
            </div>
            <button 
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-2 px-6 py-3 bg-[#0A84FF] text-white rounded-lg hover:bg-[#0A84FF]/90 transition-all shadow-sm hover:shadow-md"
            >
              <Plus className="h-5 w-5" />
              Tambah Karyawan
            </button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="text-red-400 hover:text-red-300">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-[#2C2C2E] rounded-xl p-6 shadow-sm border border-[#38383A]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#98989D] mb-1">Total Karyawan</p>
                <p className="text-3xl font-bold text-white">{stats.total}</p>
              </div>
              <div className="w-14 h-14 bg-[#0A84FF]/20 rounded-xl flex items-center justify-center">
                <Users className="h-7 w-7 text-[#0A84FF]" />
              </div>
            </div>
          </div>

          <div className="bg-[#2C2C2E] rounded-xl p-6 shadow-sm border border-[#38383A]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#98989D] mb-1">Aktif</p>
                <p className="text-3xl font-bold text-[#30D158]">{stats.active}</p>
              </div>
              <div className="w-14 h-14 bg-[#30D158]/20 rounded-xl flex items-center justify-center">
                <UserCheck className="h-7 w-7 text-[#30D158]" />
              </div>
            </div>
          </div>

          <div className="bg-[#2C2C2E] rounded-xl p-6 shadow-sm border border-[#38383A]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#98989D] mb-1">Non-Aktif</p>
                <p className="text-3xl font-bold text-[#98989D]">{stats.inactive}</p>
              </div>
              <div className="w-14 h-14 bg-[#98989D]/20 rounded-xl flex items-center justify-center">
                <Users className="h-7 w-7 text-[#98989D]" />
              </div>
            </div>
          </div>

          <div className="bg-[#2C2C2E] rounded-xl p-6 shadow-sm border border-[#38383A]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#98989D] mb-1">Departemen</p>
                <p className="text-3xl font-bold text-[#0A84FF]">{stats.departments}</p>
              </div>
              <div className="w-14 h-14 bg-[#0A84FF]/20 rounded-xl flex items-center justify-center">
                <Calendar className="h-7 w-7 text-[#0A84FF]" />
              </div>
            </div>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="bg-[#2C2C2E] rounded-xl shadow-sm border border-[#38383A] p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#636366]" />
              <input
                type="text"
                placeholder="Cari nama, ID, atau posisi karyawan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-[#1C1C1E] border border-[#38383A] rounded-lg text-white placeholder-[#636366] focus:ring-2 focus:ring-[#0A84FF] focus:border-transparent"
              />
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-3 border border-[#38383A] rounded-lg hover:bg-[#38383A]/30 transition-colors text-white"
            >
              <Filter className="h-5 w-5" />
              Filter
            </button>
          </div>

          {/* Collapsible Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-[#38383A]">
              <div>
                <label className="block text-sm font-medium text-[#98989D] mb-2">Departemen</label>
                <select 
                  value={departmentFilter}
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-[#1C1C1E] border border-[#38383A] rounded-lg text-white focus:ring-2 focus:ring-[#0A84FF]"
                >
                  <option value="">Semua Departemen</option>
                  {DEPARTMENTS.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#98989D] mb-2">Status</label>
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-[#1C1C1E] border border-[#38383A] rounded-lg text-white focus:ring-2 focus:ring-[#0A84FF]"
                >
                  <option value="">Semua Status</option>
                  <option value="active">Aktif</option>
                  <option value="inactive">Non-Aktif</option>
                  <option value="terminated">Terminated</option>
                </select>
              </div>
            </div>
          )}

          {(departmentFilter || statusFilter) && (
            <div className="mt-4 pt-4 border-t border-[#38383A]">
              <button
                onClick={() => {
                  setDepartmentFilter('');
                  setStatusFilter('');
                }}
                className="text-sm text-[#0A84FF] hover:text-[#0A84FF]/80"
              >
                Reset Filter
              </button>
            </div>
          )}
        </div>

        {/* Employee Table */}
        <div className="bg-[#2C2C2E] rounded-xl shadow-sm border border-[#38383A] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#1C1C1E] border-b border-[#38383A]">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-[#98989D] uppercase tracking-wider">
                    Karyawan
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-[#98989D] uppercase tracking-wider">
                    Posisi
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-[#98989D] uppercase tracking-wider">
                    Departemen
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-[#98989D] uppercase tracking-wider">
                    Kontak
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-[#98989D] uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-[#98989D] uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#38383A]">
                {filteredEmployees.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center">
                      <Users className="h-12 w-12 text-[#636366] mx-auto mb-3" />
                      <p className="text-[#98989D]">Tidak ada data karyawan</p>
                      <p className="text-sm text-[#636366] mt-1">Silakan tambahkan karyawan baru</p>
                    </td>
                  </tr>
                ) : (
                  filteredEmployees.map((employee) => (
                    <tr key={employee.id} className="hover:bg-[#38383A]/30 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="font-medium text-white">{employee.name}</div>
                          <div className="text-sm text-[#98989D]">{employee.employeeId}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-white">{employee.position}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-white">{employee.department}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col gap-1">
                          {employee.email && (
                            <div className="flex items-center gap-2 text-sm text-[#98989D]">
                              <Mail className="h-3.5 w-3.5" />
                              {employee.email}
                            </div>
                          )}
                          {employee.phone && (
                            <div className="flex items-center gap-2 text-sm text-[#98989D]">
                              <Phone className="h-3.5 w-3.5" />
                              {employee.phone}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(employee.status)}`}>
                          {employee.status === 'active' ? 'Aktif' : employee.status === 'inactive' ? 'Non-Aktif' : 'Terminated'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedEmployee(employee);
                              setShowDetailModal(true);
                            }}
                            className="p-2 text-[#0A84FF] hover:bg-[#0A84FF]/10 rounded-lg transition-colors"
                            title="Lihat Detail"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteEmployee(employee.id)}
                            className="p-2 text-[#FF453A] hover:bg-[#FF453A]/10 rounded-lg transition-colors"
                            title="Hapus"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Employee Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-[#2C2C2E] rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-[#38383A]">
              <div className="sticky top-0 bg-[#1C1C1E] border-b border-[#38383A] px-6 py-4 flex justify-between items-center">
                <h3 className="text-xl font-bold text-white">Tambah Karyawan Baru</h3>
                <button 
                  onClick={() => {
                    setShowAddForm(false);
                    resetForm();
                  }}
                  className="text-[#636366] hover:text-white"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleSubmitEmployee} className="p-6 space-y-6">
                {/* Basic Info */}
                <div>
                  <h4 className="font-semibold text-white mb-4">Informasi Dasar</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#98989D] mb-2">
                        ID Karyawan <span className="text-[#FF453A]">*</span>
                      </label>
                      <input
                        type="text"
                        name="employeeId"
                        value={formData.employeeId}
                        onChange={handleInputChange}
                        required
                        placeholder="EMP-001"
                        className="w-full px-3 py-2 bg-[#1C1C1E] border border-[#38383A] rounded-lg text-white placeholder-[#636366] focus:ring-2 focus:ring-[#0A84FF] focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#98989D] mb-2">
                        Nama Lengkap <span className="text-[#FF453A]">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        placeholder="Ahmad Fauzi"
                        className="w-full px-3 py-2 bg-[#1C1C1E] border border-[#38383A] rounded-lg text-white placeholder-[#636366] focus:ring-2 focus:ring-[#0A84FF] focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#98989D] mb-2">
                        Posisi <span className="text-[#FF453A]">*</span>
                      </label>
                      <select
                        name="position"
                        value={formData.position}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 bg-[#1C1C1E] border border-[#38383A] rounded-lg text-white focus:ring-2 focus:ring-[#0A84FF] focus:border-transparent"
                      >
                        <option value="">Pilih Posisi</option>
                        {POSITIONS.map(pos => (
                          <option key={pos} value={pos}>{pos}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#98989D] mb-2">
                        Departemen <span className="text-[#FF453A]">*</span>
                      </label>
                      <select
                        name="department"
                        value={formData.department}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 bg-[#1C1C1E] border border-[#38383A] rounded-lg text-white focus:ring-2 focus:ring-[#0A84FF] focus:border-transparent"
                      >
                        <option value="">Pilih Departemen</option>
                        {DEPARTMENTS.map(dept => (
                          <option key={dept} value={dept}>{dept}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Contact Info */}
                <div>
                  <h4 className="font-semibold text-white mb-4">Informasi Kontak</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#98989D] mb-2">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="ahmad@company.com"
                        className="w-full px-3 py-2 bg-[#1C1C1E] border border-[#38383A] rounded-lg text-white placeholder-[#636366] focus:ring-2 focus:ring-[#0A84FF] focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#98989D] mb-2">No. Telepon</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+62 812-3456-7890"
                        className="w-full px-3 py-2 bg-[#1C1C1E] border border-[#38383A] rounded-lg text-white placeholder-[#636366] focus:ring-2 focus:ring-[#0A84FF] focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Employment Details */}
                <div>
                  <h4 className="font-semibold text-white mb-4">Detail Pekerjaan</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#98989D] mb-2">Tanggal Bergabung</label>
                      <input
                        type="date"
                        name="joinDate"
                        value={formData.joinDate}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 bg-[#1C1C1E] border border-[#38383A] rounded-lg text-white focus:ring-2 focus:ring-[#0A84FF] focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#98989D] mb-2">Tanggal Lahir</label>
                      <input
                        type="date"
                        name="birthDate"
                        value={formData.birthDate}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 bg-[#1C1C1E] border border-[#38383A] rounded-lg text-white focus:ring-2 focus:ring-[#0A84FF] focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#98989D] mb-2">Tipe Pekerjaan</label>
                      <select
                        name="employmentType"
                        value={formData.employmentType}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 bg-[#1C1C1E] border border-[#38383A] rounded-lg text-white focus:ring-2 focus:ring-[#0A84FF] focus:border-transparent"
                      >
                        {EMPLOYMENT_TYPES.map(type => (
                          <option key={type} value={type}>
                            {type === 'permanent' ? 'Tetap' : type === 'contract' ? 'Kontrak' : 'Magang'}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#98989D] mb-2">Status</label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 bg-[#1C1C1E] border border-[#38383A] rounded-lg text-white focus:ring-2 focus:ring-[#0A84FF] focus:border-transparent"
                      >
                        {STATUS_OPTIONS.map(status => (
                          <option key={status} value={status}>
                            {status === 'active' ? 'Aktif' : status === 'inactive' ? 'Non-Aktif' : 'Terminated'}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-[#98989D] mb-2">Gaji (Rp)</label>
                      <input
                        type="number"
                        name="salary"
                        value={formData.salary}
                        onChange={handleInputChange}
                        placeholder="5000000"
                        className="w-full px-3 py-2 bg-[#1C1C1E] border border-[#38383A] rounded-lg text-white placeholder-[#636366] focus:ring-2 focus:ring-[#0A84FF] focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex gap-3 pt-4 border-t border-[#38383A]">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddForm(false);
                      resetForm();
                    }}
                    className="flex-1 px-4 py-2.5 border border-[#38383A] text-white rounded-lg hover:bg-[#38383A]/30 transition-colors font-medium"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={submitLoading}
                    className="flex-1 px-4 py-2.5 bg-[#0A84FF] text-white rounded-lg hover:bg-[#0A84FF]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
                  >
                    {submitLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Menyimpan...
                      </>
                    ) : (
                      <>
                        <UserPlus className="h-4 w-4" />
                        Tambah Karyawan
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Detail Modal */}
        {showDetailModal && selectedEmployee && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-[#2C2C2E] rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-[#38383A]">
              <div className="sticky top-0 bg-[#1C1C1E] border-b border-[#38383A] px-6 py-4 flex justify-between items-center">
                <h3 className="text-xl font-bold text-white">Detail Karyawan</h3>
                <button 
                  onClick={() => setShowDetailModal(false)}
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
                    <h4 className="text-2xl font-bold text-white">{selectedEmployee.name}</h4>
                    <p className="text-[#98989D] mt-1">{selectedEmployee.position}</p>
                    <span className={`inline-block mt-2 px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(selectedEmployee.status)}`}>
                      {selectedEmployee.status === 'active' ? 'Aktif' : selectedEmployee.status === 'inactive' ? 'Non-Aktif' : 'Terminated'}
                    </span>
                  </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-[#98989D]">ID Karyawan</label>
                    <p className="mt-1 text-white">{selectedEmployee.employeeId}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-[#98989D]">Departemen</label>
                    <p className="mt-1 text-white">{selectedEmployee.department}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-[#98989D]">Email</label>
                    <p className="mt-1 text-white">{selectedEmployee.email || '-'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-[#98989D]">Telepon</label>
                    <p className="mt-1 text-white">{selectedEmployee.phone || '-'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-[#98989D]">Tanggal Bergabung</label>
                    <p className="mt-1 text-white">
                      {selectedEmployee.joinDate ? new Date(selectedEmployee.joinDate).toLocaleDateString('id-ID') : '-'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-[#98989D]">Tipe Pekerjaan</label>
                    <p className="mt-1 text-white capitalize">{selectedEmployee.employmentType || '-'}</p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-[#98989D]">Gaji</label>
                    <p className="mt-1 text-white">
                      {selectedEmployee.salary ? `Rp ${parseInt(selectedEmployee.salary).toLocaleString('id-ID')}` : '-'}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-6 border-t border-[#38383A]">
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="flex-1 px-4 py-2.5 bg-[#38383A] text-white rounded-lg hover:bg-[#38383A]/70 transition-colors font-medium"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Manpower;
