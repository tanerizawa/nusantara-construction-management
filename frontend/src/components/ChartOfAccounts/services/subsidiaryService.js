import axios from 'axios';
import { CHART_OF_ACCOUNTS_CONFIG } from '../config/chartOfAccountsConfig';

const { endpoints } = CHART_OF_ACCOUNTS_CONFIG;

/**
 * Format address from JSONB to string
 */
const formatAddress = (addressObj) => {
  if (typeof addressObj === 'string') return addressObj;
  if (!addressObj) return '';
  
  const parts = [];
  if (addressObj.street) parts.push(addressObj.street);
  if (addressObj.city) parts.push(addressObj.city);
  if (addressObj.province) parts.push(addressObj.province);
  if (addressObj.postalCode) parts.push(addressObj.postalCode);
  
  return parts.join(', ');
};

/**
 * Transform subsidiary from backend JSONB structure to frontend flat structure
 */
const transformSubsidiaryToFrontend = (subsidiary) => {
  if (!subsidiary) return null;
  
  return {
    id: subsidiary.id,
    name: subsidiary.name,
    code: subsidiary.code,
    description: subsidiary.description,
    specialization: subsidiary.specialization,
    
    // Extract from JSONB contactInfo
    phone: subsidiary.contactInfo?.phone || null,
    email: subsidiary.contactInfo?.email || null,
    fax: subsidiary.contactInfo?.fax || null,
    website: subsidiary.contactInfo?.website || null,
    
    // Extract from JSONB address
    address: formatAddress(subsidiary.address),
    addressObj: subsidiary.address,
    city: subsidiary.address?.city || null,
    province: subsidiary.address?.province || null,
    postalCode: subsidiary.address?.postalCode || null,
    
    // Extract from JSONB legalInfo
    taxId: subsidiary.legalInfo?.taxIdentificationNumber || null,
    legalName: subsidiary.legalInfo?.companyRegistrationNumber || null,
    
    // Status
    isActive: subsidiary.status === 'active',
    status: subsidiary.status,
    
    // Additional
    accountCount: subsidiary.accountCount || 0,
    logo: subsidiary.logo,
    establishedYear: subsidiary.establishedYear,
    employeeCount: subsidiary.employeeCount,
    boardOfDirectors: subsidiary.boardOfDirectors,
    parentCompany: subsidiary.parentCompany || 'Nusantara Group',
    
    // Timestamps
    createdAt: subsidiary.created_at || subsidiary.createdAt,
    updatedAt: subsidiary.updated_at || subsidiary.updatedAt,
    
    _original: subsidiary
  };
};

/**
 * Transform subsidiary from frontend flat structure to backend JSONB structure
 */
const transformSubsidiaryToBackend = (subsidiaryData) => {
  return {
    name: subsidiaryData.name,
    code: subsidiaryData.code?.toUpperCase(),
    description: subsidiaryData.description,
    specialization: subsidiaryData.specialization || 'general',
    
    // Transform to JSONB fields
    phone: subsidiaryData.phone,
    email: subsidiaryData.email,
    fax: subsidiaryData.fax,
    website: subsidiaryData.website,
    
    address: subsidiaryData.address,
    city: subsidiaryData.city,
    province: subsidiaryData.province,
    postalCode: subsidiaryData.postalCode,
    
    taxId: subsidiaryData.taxId,
    legalName: subsidiaryData.legalName,
    
    status: subsidiaryData.isActive !== undefined 
      ? (subsidiaryData.isActive ? 'active' : 'inactive')
      : (subsidiaryData.status || 'active')
  };
};

/**
 * Fetch all subsidiaries from the API
 */
export const fetchSubsidiaries = async (activeOnly = true) => {
  try {
    const response = await axios.get(endpoints.subsidiaries, {
      params: { active_only: activeOnly ? 'true' : 'false' }
    });
    
    const data = response.data.data || response.data.subsidiaries || [];
    const transformed = data.map(transformSubsidiaryToFrontend);
    
    return {
      success: true,
      data: transformed,
      message: response.data.message
    };
  } catch (error) {
    console.error('Error fetching subsidiaries:', error);
    return {
      success: false,
      data: [],
      error: error.response?.data?.error || error.response?.data?.message || error.message
    };
  }
};

/**
 * Create a new subsidiary
 */
export const createSubsidiary = async (subsidiaryData) => {
  try {
    const payload = transformSubsidiaryToBackend(subsidiaryData);
    const response = await axios.post(endpoints.subsidiaries, payload);
    const transformed = transformSubsidiaryToFrontend(response.data.data);
    
    return {
      success: true,
      data: transformed,
      message: response.data.message || 'Subsidiary created successfully'
    };
  } catch (error) {
    console.error('Error creating subsidiary:', error);
    return {
      success: false,
      error: error.response?.data?.error || error.response?.data?.message || error.message
    };
  }
};

/**
 * Update an existing subsidiary
 */
export const updateSubsidiary = async (subsidiaryId, subsidiaryData) => {
  try {
    const payload = transformSubsidiaryToBackend(subsidiaryData);
    const response = await axios.put(`${endpoints.subsidiaries}/${subsidiaryId}`, payload);
    const transformed = transformSubsidiaryToFrontend(response.data.data);
    
    return {
      success: true,
      data: transformed,
      message: response.data.message || 'Subsidiary updated successfully'
    };
  } catch (error) {
    console.error('Error updating subsidiary:', error);
    return {
      success: false,
      error: error.response?.data?.error || error.response?.data?.message || error.message
    };
  }
};

/**
 * Delete a subsidiary (soft delete - sets status to inactive)
 */
export const deleteSubsidiary = async (subsidiaryId) => {
  try {
    const response = await axios.delete(`${endpoints.subsidiaries}/${subsidiaryId}`);
    return {
      success: true,
      data: response.data,
      message: response.data.message || 'Subsidiary deactivated successfully'
    };
  } catch (error) {
    console.error('Error deleting subsidiary:', error);
    return {
      success: false,
      error: error.response?.data?.error || error.response?.data?.message || error.message
    };
  }
};

/**
 * Get subsidiary by ID
 */
export const getSubsidiaryById = async (subsidiaryId) => {
  try {
    const response = await axios.get(`${endpoints.subsidiaries}/${subsidiaryId}`);
    const transformed = transformSubsidiaryToFrontend(response.data.data);
    
    return {
      success: true,
      data: transformed,
      message: response.data.message || 'Subsidiary retrieved successfully'
    };
  } catch (error) {
    console.error('Error fetching subsidiary:', error);
    return {
      success: false,
      error: error.response?.data?.error || error.response?.data?.message || error.message
    };
  }
};