/**
 * Constants for Subsidiaries module
 */

// Specialization options
export const SPECIALIZATIONS = [
  { value: '', label: 'Semua Spesialisasi' },
  { value: 'residential', label: 'Perumahan' },
  { value: 'commercial', label: 'Komersial' },
  { value: 'industrial', label: 'Industri' },
  { value: 'infrastructure', label: 'Infrastruktur' },
  { value: 'renovation', label: 'Renovasi' },
  { value: 'interior', label: 'Interior' },
  { value: 'landscaping', label: 'Lansekap' },
  { value: 'general', label: 'Umum' }
];

// Status filter options
export const STATUS_OPTIONS = [
  { value: '', label: 'Semua Status' },
  { value: 'active', label: 'Aktif' },
  { value: 'inactive', label: 'Tidak Aktif' }
];

// Specialization display map
export const SPECIALIZATION_LABELS = {
  residential: 'Perumahan',
  commercial: 'Komersial',
  industrial: 'Industri',
  infrastructure: 'Infrastruktur',
  renovation: 'Renovasi',
  interior: 'Interior',
  landscaping: 'Lansekap',
  general: 'Umum'
};