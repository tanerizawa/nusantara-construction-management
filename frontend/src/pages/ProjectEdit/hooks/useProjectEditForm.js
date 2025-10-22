import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { projectAPI, subsidiaryAPI } from '../../../services/api';

/**
 * Custom hook for managing project edit form state and logic
 * 
 * @param {string} projectId - The ID of the project to edit
 * @returns {object} Form state, handlers, and API interaction functions
 */
export const useProjectEditForm = (projectId) => {
  const navigate = useNavigate();
  
  // Loading and error states
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  // Subsidiary data
  const [subsidiaries, setSubsidiaries] = useState([]);
  const [loadingSubsidiaries, setLoadingSubsidiaries] = useState(true);
  
  // Form data state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    client: {
      company: '',
      contact: '',
      phone: '',
      email: ''
    },
    location: {
      address: '',
      village: '',
      district: '',
      city: '',
      province: ''
    },
    coordinates: {
      latitude: null,
      longitude: null,
      radius: 100
    },
    timeline: {
      startDate: '',
      endDate: ''
    },
    budget: {
      contractValue: 0
    },
    status: 'planning',
    priority: 'medium',
    progress: 0,
    subsidiary: {
      id: '',
      name: '',
      code: ''
    }
  });

  // Format date for HTML input (YYYY-MM-DD)
  const formatDateForInput = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return '';
    return date.toISOString().split('T')[0];
  };

  // Fetch project data
  const fetchProject = useCallback(async () => {
    try {
      setLoading(true);
      const response = await projectAPI.getById(projectId);
      const projectData = response.data || response;
      
      setProject(projectData);
      
      // Handle different possible data structures from API
      const clientCompany = projectData.clientName || projectData.client?.company || '';
      
      // For contact field, check multiple possible locations
      const clientContact = 
        projectData.clientContact?.contact ||      // New format: clientContact.contact
        projectData.client?.contact ||             // Alternative: client.contact
        projectData.clientContact?.contactPerson || // Legacy: clientContact.contactPerson
        projectData.clientContact?.person ||       // Alternative: clientContact.person
        '';
        
      const clientPhone = projectData.clientContact?.phone || projectData.client?.phone || '';
      const clientEmail = projectData.clientContact?.email || projectData.client?.email || '';
      
      const budgetValue = projectData.budget?.contractValue || projectData.budget?.total || projectData.budget || 0;
      const startDate = projectData.timeline?.startDate || projectData.startDate || '';
      const endDate = projectData.timeline?.endDate || projectData.endDate || '';
      const progress = projectData.progress?.percentage || projectData.progress || 0;
      
      // Handle subsidiary data
      const subsidiary = projectData.subsidiary || projectData.subsidiaryInfo || {
        id: '',
        name: '',
        code: ''
      };
      
      // Populate form with existing data - use same structure as ProjectCreate
      setFormData({
        name: projectData.name || '',
        description: projectData.description || '',
        client: {
          company: clientCompany,
          contact: clientContact,
          phone: clientPhone,
          email: clientEmail
        },
        location: {
          address: projectData.location?.address || '',
          village: projectData.location?.village || '',   // NEW
          district: projectData.location?.district || '', // NEW
          city: projectData.location?.city || '',
          province: projectData.location?.province || ''
        },
        coordinates: {
          latitude: null,  // Will be loaded from ProjectLocation API in LocationSection
          longitude: null,
          radius: 100
        },
        timeline: {
          startDate: formatDateForInput(startDate),
          endDate: formatDateForInput(endDate)
        },
        budget: {
          contractValue: Number(budgetValue) || 0
        },
        status: projectData.status || 'planning',
        priority: projectData.priority || 'medium',
        progress: Number(progress) || 0,
        subsidiary: {
          id: subsidiary.id || '',
          name: subsidiary.name || '',
          code: subsidiary.code || ''
        }
      });
      
      setError('');
    } catch (err) {
      console.error('Error fetching project:', err);
      setError('Gagal memuat data proyek. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  // Fetch subsidiaries
  const fetchSubsidiaries = useCallback(async () => {
    try {
      setLoadingSubsidiaries(true);
      const response = await subsidiaryAPI.getAll();
      if (response.success) {
        setSubsidiaries(response.data);
      } else {
        console.error('Failed to fetch subsidiaries:', response.message);
      }
    } catch (error) {
      console.error('Error fetching subsidiaries:', error);
      setSubsidiaries([]);
    } finally {
      setLoadingSubsidiaries(false);
    }
  }, []);

  // Handle form input changes
  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  // Handle subsidiary selection
  const handleSubsidiaryChange = (subsidiaryId) => {
    const selectedSubsidiary = subsidiaries.find(sub => sub.id === subsidiaryId);
    if (selectedSubsidiary) {
      setFormData(prev => ({
        ...prev,
        subsidiary: {
          id: selectedSubsidiary.id,
          code: selectedSubsidiary.code,
          name: selectedSubsidiary.name
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        subsidiary: { id: '', name: '', code: '' }
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccessMessage('');

    try {
      // Prepare data with consistent structure
      const updateData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        clientName: formData.client.company.trim(),
        clientContact: {
          contact: formData.client.contact.trim(),
          phone: formData.client.phone.trim(),
          email: formData.client.email.trim()
        },
        location: {
          address: formData.location.address.trim(),
          village: formData.location.village.trim(),   // NEW
          district: formData.location.district.trim(), // NEW
          city: formData.location.city.trim(),
          province: formData.location.province.trim()
        },
        coordinates: (formData.coordinates?.latitude && formData.coordinates?.longitude) ? {
          latitude: formData.coordinates.latitude,
          longitude: formData.coordinates.longitude,
          radius: formData.coordinates.radius || 100
        } : null,
        budget: Number(formData.budget.contractValue) || 0,
        startDate: formData.timeline.startDate,
        endDate: formData.timeline.endDate,
        status: formData.status,
        priority: formData.priority,
        progress: Number(formData.progress) || 0,
        subsidiary: {
          id: formData.subsidiary.id,
          code: formData.subsidiary.code,
          name: formData.subsidiary.name
        }
      };

      const response = await projectAPI.update(projectId, updateData);
      
      if (response.success !== false) {
        setSuccessMessage('Proyek berhasil diperbarui!');
        setTimeout(() => {
          navigate(`/admin/projects/${projectId}`);
        }, 1500);
      } else {
        throw new Error(response.message || 'Gagal memperbarui proyek');
      }
    } catch (err) {
      console.error('Error updating project:', err);
      setError(err.response?.data?.message || err.message || 'Gagal memperbarui proyek. Silakan coba lagi.');
    } finally {
      setSaving(false);
    }
  };

  // Load data when component mounts
  useEffect(() => {
    fetchProject();
    fetchSubsidiaries();
  }, [fetchProject, fetchSubsidiaries]);

  return {
    project,
    loading,
    saving,
    error,
    successMessage,
    subsidiaries,
    loadingSubsidiaries,
    formData,
    handleInputChange,
    handleSubsidiaryChange,
    handleSubmit,
    setError,
    setSuccessMessage
  };
};