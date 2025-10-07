import React, { useState, useEffect, useMemo } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Users,
  User,
  Mail,
  Phone,
  Calendar,
  Award,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  Search,
  Filter
} from 'lucide-react';
import { employeeAPI, projectAPI } from '../services/api';
import { formatCurrency, formatDate } from '../utils/formatters';

const ProjectTeam = ({ project, onUpdate }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [availableEmployees, setAvailableEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  
  // Project team members with enhanced data
  const [teamMembers, setTeamMembers] = useState([]);

  // Load existing team members from database
  const loadTeamMembers = async () => {
    try {
      const response = await projectAPI.getTeamMembers(project.id);
      if (response.data && response.data.length > 0) {
        // Map backend data to frontend format
        const mappedMembers = response.data.map(member => ({
          id: member.id,
          employeeId: member.employeeId,
          name: member.name,
          role: member.role,
          email: member.email || '',
          phone: member.phone || '',
          joinDate: member.joinDate ? member.joinDate.split('T')[0] : '',
          allocation: parseFloat(member.allocation) || 100,
          hourlyRate: parseFloat(member.hourlyRate) || 0,
          totalHours: parseFloat(member.totalHours) || 0,
          totalCost: parseFloat(member.totalCost) || 0,
          status: member.status || 'active',
          skills: member.skills ? (typeof member.skills === 'string' ? JSON.parse(member.skills) : member.skills) : [],
          certifications: member.certifications ? (typeof member.certifications === 'string' ? JSON.parse(member.certifications) : member.certifications) : [],
          performance: parseFloat(member.performance) || 0,
          responsibilities: member.responsibilities ? (typeof member.responsibilities === 'string' ? JSON.parse(member.responsibilities) : member.responsibilities) : [],
          notes: member.notes || '',
          createdAt: member.createdAt,
          updatedAt: member.updatedAt
        }));
        setTeamMembers(mappedMembers);
      } else {
        // Set empty array if no team members exist
        setTeamMembers([]);
      }
    } catch (error) {
      console.error('Error loading team members:', error);
      // Set empty array on error
      setTeamMembers([]);
    }
  };

  // Load team members when component mounts
  useEffect(() => {
    loadTeamMembers();
  }, [project.id]);

  // Fetch available employees
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await employeeAPI.getAll();
        setAvailableEmployees(response.data || []);
      } catch (error) {
        console.error('Error fetching employees:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  // Calculate team statistics
  const teamStats = useMemo(() => {
    const totalMembers = teamMembers.length;
    const activeMembers = teamMembers.filter(m => m.status === 'active').length;
    const totalCost = teamMembers.reduce((sum, m) => sum + m.totalCost, 0);
    const totalHours = teamMembers.reduce((sum, m) => sum + m.totalHours, 0);
    const avgPerformance = teamMembers.reduce((sum, m) => sum + m.performance, 0) / totalMembers;
    const avgAllocation = teamMembers.reduce((sum, m) => sum + m.allocation, 0) / totalMembers;
    
    return {
      totalMembers,
      activeMembers,
      totalCost,
      totalHours,
      avgPerformance: avgPerformance || 0,
      avgAllocation: avgAllocation || 0
    };
  }, [teamMembers]);

  // Role categories
  const roles = {
    'Project Manager': { color: 'blue', count: 0 },
    'Civil Engineer': { color: 'green', count: 0 },
    'Electrical Engineer': { color: 'yellow', count: 0 },
    'Safety Officer': { color: 'red', count: 0 },
    'Site Supervisor': { color: 'purple', count: 0 },
    'Quality Controller': { color: 'indigo', count: 0 }
  };

  // Count roles
  teamMembers.forEach(member => {
    if (roles[member.role]) {
      roles[member.role].count++;
    }
  });

  // Removed duplicate formatCurrency and formatDate - using imported from utils

  const TeamMemberForm = ({ member, onSave, onCancel }) => {
    const [formData, setFormData] = useState(member || {
      employeeId: '',
      role: 'Civil Engineer',
      allocation: 100,
      hourlyRate: 120000,
      responsibilities: [''],
      notes: ''
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      
      // Find employee data
      const employee = availableEmployees.find(emp => emp.id === formData.employeeId);
      if (!employee) {
        alert('Please select a valid employee');
        return;
      }

      const memberData = {
        ...formData,
        id: member?.id || `TM${Date.now()}`,
        name: employee.name,
        email: employee.email,
        phone: employee.phone,
        joinDate: member?.joinDate || new Date().toISOString().split('T')[0],
        totalHours: member?.totalHours || 0,
        totalCost: member?.totalCost || 0,
        status: member?.status || 'active',
        skills: employee.skills?.map(s => s.name) || [],
        certifications: employee.certifications || [],
        performance: member?.performance || 85
      };

      onSave(memberData);
    };

    const updateResponsibility = (index, value) => {
      const newResponsibilities = [...formData.responsibilities];
      newResponsibilities[index] = value;
      setFormData({ ...formData, responsibilities: newResponsibilities });
    };

    const addResponsibility = () => {
      setFormData({ 
        ...formData, 
        responsibilities: [...formData.responsibilities, ''] 
      });
    };

    const removeResponsibility = (index) => {
      const newResponsibilities = formData.responsibilities.filter((_, i) => i !== index);
      setFormData({ ...formData, responsibilities: newResponsibilities });
    };

    return (
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
        style={{
          zIndex: 9999,
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <div 
          className="bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto"
          style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            maxWidth: '672px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
          }}
        >
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold">
              {member ? 'Edit Team Member' : 'Tambah Team Member'}
            </h3>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Pilih Karyawan</label>
              <select
                value={formData.employeeId}
                onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
                required
                disabled={!!member} // Can't change employee for existing member
              >
                <option value="">Pilih Karyawan</option>
                {availableEmployees.map(emp => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name} - {emp.position}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Role dalam Proyek</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                  required
                >
                  {Object.keys(roles).map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Alokasi (%)</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={formData.allocation}
                  onChange={(e) => setFormData({ ...formData, allocation: parseInt(e.target.value) || 0 })}
                  className="w-full border rounded-lg px-3 py-2"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Hourly Rate (Rp)</label>
              <input
                type="number"
                value={formData.hourlyRate}
                onChange={(e) => setFormData({ ...formData, hourlyRate: parseInt(e.target.value) || 0 })}
                className="w-full border rounded-lg px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Tanggung Jawab</label>
              {formData.responsibilities.map((resp, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={resp}
                    onChange={(e) => updateResponsibility(index, e.target.value)}
                    className="flex-1 border rounded-lg px-3 py-2"
                    placeholder="Tanggung jawab"
                  />
                  <button
                    type="button"
                    onClick={() => removeResponsibility(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addResponsibility}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
              >
                <Plus size={16} />
                Tambah Tanggung Jawab
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Catatan</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
                rows={3}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
              >
                {member ? 'Update' : 'Tambah'}
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400"
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Database operations
  const handleSaveMember = async (memberData) => {
    try {
      // Prepare data with projectId and proper structure
      const teamMemberData = {
        name: memberData.name,
        role: memberData.role,
        email: memberData.email || '',
        phone: memberData.phone || '',
        employeeId: memberData.employeeId || '',
        joinDate: memberData.joinDate,
        allocation: parseFloat(memberData.allocation) || 100,
        hourlyRate: parseFloat(memberData.hourlyRate) || 0,
        status: memberData.status || 'active',
        skills: JSON.stringify(memberData.skills || []),
        certifications: JSON.stringify(memberData.certifications || []),
        responsibilities: JSON.stringify(memberData.responsibilities || []),
        performance: parseFloat(memberData.performance) || 0,
        notes: memberData.notes || '',
        addedBy: 'current_user' // Should get from auth context
      };

      if (editingMember) {
        // Update existing member
        await projectAPI.updateTeamMember(project.id, editingMember.id, teamMemberData);
        
        setEditingMember(null);
        alert('Anggota tim berhasil diperbarui!');
      } else {
        // Add new member
        await projectAPI.addTeamMember(project.id, teamMemberData);
        
        setShowAddForm(false);
        alert('Anggota tim berhasil ditambahkan!');
      }
      
      // Reload team members to get updated data from database
      await loadTeamMembers();
      
      // Update project with new team data
      onUpdate({ 
        team: {
          members: teamMembers,
          stats: teamStats,
          updatedAt: new Date().toISOString()
        }
      });
      
    } catch (error) {
      console.error('Error saving team member:', error);
      alert('Gagal menyimpan anggota tim. Silakan coba lagi.');
    }
  };

  const handleDeleteMember = async (memberId) => {
    if (!window.confirm('Yakin ingin menghapus anggota tim ini?')) return;
    
    try {
      await projectAPI.removeTeamMember(project.id, memberId);
      
      // Reload team members to get updated data from database
      await loadTeamMembers();
      
      // Update project team data
      onUpdate({ 
        team: {
          members: teamMembers,
          stats: teamStats,
          updatedAt: new Date().toISOString()
        }
      });
      
      alert('Anggota tim berhasil dihapus!');
      
    } catch (error) {
      console.error('Error removing team member:', error);
      alert('Gagal menghapus anggota tim. Silakan coba lagi.');
    }
  };

  // Filter team members
  const filteredMembers = teamMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || member.role === filterRole;
    return matchesSearch && matchesRole;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading team data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-semibold">Project Team</h3>
          <p className="text-gray-600">Kelola anggota tim proyek</p>
        </div>
        <button 
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus size={16} />
          Tambah Anggota
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 text-blue-600 mb-2">
            <Users size={20} />
            <span className="font-medium">Total Anggota</span>
          </div>
          <div className="text-2xl font-bold text-blue-700">{teamStats.totalMembers}</div>
          <div className="text-sm text-blue-600">{teamStats.activeMembers} aktif</div>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 text-green-600 mb-2">
            <DollarSign size={20} />
            <span className="font-medium">Total Cost</span>
          </div>
          <div className="text-2xl font-bold text-green-700">
            {formatCurrency(teamStats.totalCost)}
          </div>
        </div>

        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 text-yellow-600 mb-2">
            <Clock size={20} />
            <span className="font-medium">Total Hours</span>
          </div>
          <div className="text-2xl font-bold text-yellow-700">
            {teamStats.totalHours.toLocaleString('id-ID')}
          </div>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 text-purple-600 mb-2">
            <Award size={20} />
            <span className="font-medium">Avg Performance</span>
          </div>
          <div className="text-2xl font-bold text-purple-700">
            {teamStats.avgPerformance.toFixed(1)}%
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Cari anggota tim..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
          />
        </div>
        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className="border rounded-lg px-3 py-2"
        >
          <option value="all">Semua Role</option>
          {Object.keys(roles).map(role => (
            <option key={role} value={role}>{role}</option>
          ))}
        </select>
      </div>

      {/* Team Members Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredMembers.map((member) => (
          <div key={member.id} className="bg-white rounded-lg border p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <User size={24} className="text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{member.name}</h4>
                  <p className="text-blue-600 font-medium">{member.role}</p>
                  <p className="text-sm text-gray-500">ID: {member.employeeId}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                  member.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {member.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
                </span>
                <button
                  onClick={() => setEditingMember(member)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => handleDeleteMember(member.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            {/* Contact Info */}
            <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <Mail size={14} />
                <span>{member.email}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Phone size={14} />
                <span>{member.phone}</span>
              </div>
            </div>

            {/* Performance and Allocation */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Performance</span>
                  <span className="font-medium">{member.performance}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full"
                    style={{ width: `${member.performance}%` }}
                  />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Allocation</span>
                  <span className="font-medium">{member.allocation}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${member.allocation}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Cost and Hours */}
            <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
              <div>
                <span className="text-gray-600">Total Hours:</span>
                <div className="font-semibold">{member.totalHours} jam</div>
              </div>
              <div>
                <span className="text-gray-600">Total Cost:</span>
                <div className="font-semibold">{formatCurrency(member.totalCost)}</div>
              </div>
            </div>

            {/* Skills */}
            {member.skills && member.skills.length > 0 && (
              <div className="mb-4">
                <h5 className="text-sm font-medium text-gray-900 mb-2">Skills:</h5>
                <div className="flex flex-wrap gap-1">
                  {member.skills.map((skill, i) => (
                    <span key={i} className="inline-flex px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Responsibilities */}
            {member.responsibilities && member.responsibilities.length > 0 && (
              <div>
                <h5 className="text-sm font-medium text-gray-900 mb-2">Tanggung Jawab:</h5>
                <ul className="text-sm text-gray-600 space-y-1">
                  {member.responsibilities.map((resp, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0" />
                      {resp}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {member.notes && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-700">{member.notes}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredMembers.length === 0 && (
        <div className="text-center py-12">
          <Users size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada anggota tim</h3>
          <p className="text-gray-600">
            {searchTerm || filterRole !== 'all' 
              ? 'Tidak ada anggota yang sesuai dengan filter' 
              : 'Belum ada anggota tim yang ditambahkan'
            }
          </p>
        </div>
      )}

      {/* Forms */}
      {showAddForm && (
        <TeamMemberForm
          onSave={handleSaveMember}
          onCancel={() => setShowAddForm(false)}
        />
      )}
      
      {editingMember && (
        <TeamMemberForm
          member={editingMember}
          onSave={handleSaveMember}
          onCancel={() => setEditingMember(null)}
        />
      )}
    </div>
  );
};

export default ProjectTeam;
