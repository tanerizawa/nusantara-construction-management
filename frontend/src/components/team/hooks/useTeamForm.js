import { useState } from 'react';
import { projectAPI } from '../../../services/api';

export const useTeamForm = (projectId, member, availableEmployees, onSuccess) => {
  const [formData, setFormData] = useState(member || {
    employeeId: '',
    role: 'Civil Engineer',
    allocation: 100,
    hourlyRate: 120000,
    responsibilities: [''],
    notes: ''
  });

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

  const handleSubmit = async (e) => {
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

      if (member) {
        // Update existing member
        await projectAPI.updateTeamMember(projectId, member.id, teamMemberData);
        alert('Anggota tim berhasil diperbarui!');
      } else {
        // Add new member
        await projectAPI.addTeamMember(projectId, teamMemberData);
        alert('Anggota tim berhasil ditambahkan!');
      }
      
      onSuccess();
    } catch (error) {
      console.error('Error saving team member:', error);
      alert('Gagal menyimpan anggota tim. Silakan coba lagi.');
    }
  };

  return {
    formData,
    setFormData,
    updateResponsibility,
    addResponsibility,
    removeResponsibility,
    handleSubmit
  };
};
