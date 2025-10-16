/**
 * Form validation and data preparation utilities
 */

/**
 * Prepares form data for API submission
 * @param {Object} formData - Raw form data
 * @returns {Object} - Processed form data ready for API
 */
export const prepareFormData = (formData) => {
  return {
    ...formData,
    employeeCount: formData.employeeCount ? parseInt(formData.employeeCount) : null,
    establishedYear: formData.establishedYear ? parseInt(formData.establishedYear) : null,
    financialInfo: {
      ...formData.financialInfo,
      paidUpCapital: formData.financialInfo.paidUpCapital 
        ? parseFloat(formData.financialInfo.paidUpCapital) 
        : null,
      authorizedCapital: formData.financialInfo.authorizedCapital 
        ? parseFloat(formData.financialInfo.authorizedCapital) 
        : null
    }
  };
};