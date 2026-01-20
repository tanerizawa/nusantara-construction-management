/**
 * RAB Categories Configuration
 * Defines work categories for construction RAB items
 */

export const RAB_CATEGORIES = [
  { value: 'Pekerjaan Persiapan', label: 'Pekerjaan Persiapan', color: 'blue' },
  { value: 'Pekerjaan Tanah', label: 'Pekerjaan Tanah', color: 'orange' },
  { value: 'Pekerjaan Pondasi', label: 'Pekerjaan Pondasi', color: 'green' },
  { value: 'Pekerjaan Struktur', label: 'Pekerjaan Struktur', color: 'blue' },
  { value: 'Pekerjaan Arsitektur', label: 'Pekerjaan Arsitektur', color: 'purple' },
  { value: 'Pekerjaan Atap', label: 'Pekerjaan Atap', color: 'red' },
  { value: 'Pekerjaan MEP', label: 'Pekerjaan MEP', color: 'yellow' },
  { value: 'Pekerjaan Finishing', label: 'Pekerjaan Finishing', color: 'pink' }
];

export const CATEGORY_COLORS = {
  'Material': 'blue',
  'Tenaga Kerja': 'green',
  'Peralatan': 'yellow',
  'Subkontraktor': 'purple',
  'Overhead': 'gray'
};

export const getCategoryColor = (category) => {
  const categoryConfig = RAB_CATEGORIES.find(cat => cat.value === category);
  return categoryConfig ? categoryConfig.color : 'gray';
};
