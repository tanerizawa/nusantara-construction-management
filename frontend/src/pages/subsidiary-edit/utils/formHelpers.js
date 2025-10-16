// Utility functions for subsidiary edit form
export const updateNestedField = (obj, path, value) => {
  const keys = path.split('.');
  const newObj = { ...obj };
  let current = newObj;
  
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    current[key] = { ...current[key] };
    current = current[key];
  }
  
  current[keys[keys.length - 1]] = value;
  return newObj;
};

export const getNestedValue = (obj, path) => {
  const keys = path.split('.');
  let current = obj;
  
  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = current[key];
    } else {
      return undefined;
    }
  }
  
  return current;
};

export const addArrayItem = (obj, path, item) => {
  const keys = path.split('.');
  const newObj = { ...obj };
  let current = newObj;
  
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    current[key] = { ...current[key] };
    current = current[key];
  }
  
  const arrayKey = keys[keys.length - 1];
  current[arrayKey] = [...(current[arrayKey] || []), item];
  return newObj;
};

export const removeArrayItem = (obj, path, index) => {
  const keys = path.split('.');
  const newObj = { ...obj };
  let current = newObj;
  
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    current[key] = { ...current[key] };
    current = current[key];
  }
  
  const arrayKey = keys[keys.length - 1];
  current[arrayKey] = (current[arrayKey] || []).filter((_, i) => i !== index);
  return newObj;
};

export const updateArrayItem = (obj, path, index, updates) => {
  const keys = path.split('.');
  const newObj = { ...obj };
  let current = newObj;
  
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    current[key] = { ...current[key] };
    current = current[key];
  }
  
  const arrayKey = keys[keys.length - 1];
  current[arrayKey] = (current[arrayKey] || []).map((item, i) => 
    i === index ? { ...item, ...updates } : item
  );
  return newObj;
};

export const formatCurrency = (amount, currency = 'IDR') => {
  if (!amount) return '';
  
  const formatter = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0
  });
  
  return formatter.format(amount);
};

export const formatDate = (date) => {
  if (!date) return '';
  
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
};

export const transformFormDataForAPI = (formData) => {
  // Transform form data to match API expectations
  return {
    ...formData,
    establishedYear: formData.establishedYear ? parseInt(formData.establishedYear) : null,
    employeeCount: formData.employeeCount ? parseInt(formData.employeeCount) : null,
    financialInfo: {
      ...formData.financialInfo,
      authorizedCapital: formData.financialInfo.authorizedCapital ? 
        parseFloat(formData.financialInfo.authorizedCapital) : null,
      paidUpCapital: formData.financialInfo.paidUpCapital ? 
        parseFloat(formData.financialInfo.paidUpCapital) : null
    }
  };
};

export const transformAPIDataForForm = (apiData) => {
  // Transform API data to match form expectations
  return {
    ...apiData,
    establishedYear: apiData.establishedYear?.toString() || '',
    employeeCount: apiData.employeeCount?.toString() || '',
    financialInfo: {
      ...apiData.financialInfo,
      authorizedCapital: apiData.financialInfo?.authorizedCapital?.toString() || '',
      paidUpCapital: apiData.financialInfo?.paidUpCapital?.toString() || ''
    }
  };
};