/**
 * Utility functions for Subsidiary Detail page
 * Formatting and helper functions
 */

/**
 * Get specialization label in Indonesian
 */
export const getSpecializationLabel = (spec) => {
  const labels = {
    residential: 'Bangunan Gedung Tempat Tinggal',
    commercial: 'Bangunan Gedung Perkantoran & Komersial',
    infrastructure: 'Infrastruktur Jalan & Jembatan',
    industrial: 'Bangunan Industri & Pabrik',
    renovation: 'Pemeliharaan & Renovasi Bangunan',
    interior: 'Finishing & Interior',
    landscaping: 'Pertamanan & Lansekap',
    general: 'Konstruksi Umum',
    civil: 'Teknik Sipil',
    mechanical: 'Mekanikal & Elektrikal (ME)',
    specialstructure: 'Konstruksi Khusus & Struktur Berat'
  };
  return labels[spec] || 'Konstruksi Umum';
};

/**
 * Get document category label in Indonesian
 */
export const getCategoryLabel = (category) => {
  const categories = {
    siup: 'SIUP (Surat Izin Usaha Perdagangan)',
    situ: 'SITU (Surat Izin Tempat Usaha)',
    siujk: 'SIUJK (Surat Izin Usaha Jasa Konstruksi)',
    sbu: 'SBU (Sertifikat Badan Usaha)',
    iso: 'Sertifikat ISO',
    k3: 'Sertifikat K3 (Keselamatan & Kesehatan Kerja)',
    npwp: 'NPWP Perusahaan',
    tdp: 'TDP (Tanda Daftar Perusahaan)',
    akta: 'Akta Pendirian Perusahaan',
    sk: 'SK Kemenkumham',
    other: 'Dokumen Lainnya'
  };
  return categories[category] || category;
};

/**
 * Get company size label in Indonesian
 */
export const getCompanySizeLabel = (size) => {
  const labels = {
    small: 'Kecil (1-50 karyawan)',
    medium: 'Menengah (51-200 karyawan)', 
    large: 'Besar (200+ karyawan)'
  };
  return labels[size] || size;
};

/**
 * Format currency to Indonesian Rupiah format
 */
export const formatCurrency = (amount, currency = 'IDR') => {
  if (!amount) return '-';
  
  const formatted = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0
  }).format(amount);
  
  return formatted;
};

/**
 * Get permit status color classes
 */
export const getPermitStatusColor = (status) => {
  const colors = {
    active: 'bg-green-100 text-green-800',
    expired: 'bg-red-100 text-red-800',
    pending: 'bg-yellow-100 text-yellow-800'
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};

/**
 * Download file blob
 */
export const downloadFile = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
};
