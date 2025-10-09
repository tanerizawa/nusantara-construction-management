/**
 * Validasi data Berita Acara
 */
export const validateBAData = (baData) => {
  const errors = {};

  // Validasi BA Number
  if (!baData.baNumber || baData.baNumber.trim() === '') {
    errors.baNumber = 'Nomor BA harus diisi';
  }

  // Validasi Work Description
  if (!baData.workDescription || baData.workDescription.trim() === '') {
    errors.workDescription = 'Deskripsi pekerjaan harus diisi';
  } else if (baData.workDescription.length < 10) {
    errors.workDescription = 'Deskripsi minimal 10 karakter';
  }

  // Validasi Completion Date
  if (!baData.completionDate) {
    errors.completionDate = 'Tanggal penyelesaian harus diisi';
  } else {
    const date = new Date(baData.completionDate);
    if (isNaN(date.getTime())) {
      errors.completionDate = 'Format tanggal tidak valid';
    }
  }

  // Validasi Completion Percentage
  if (baData.completionPercentage === undefined || baData.completionPercentage === null) {
    errors.completionPercentage = 'Persentase penyelesaian harus diisi';
  } else if (baData.completionPercentage < 0 || baData.completionPercentage > 100) {
    errors.completionPercentage = 'Persentase harus antara 0-100';
  }

  // Validasi Payment Amount (optional, but if provided must be valid)
  if (baData.paymentAmount !== undefined && baData.paymentAmount !== null) {
    if (baData.paymentAmount < 0) {
      errors.paymentAmount = 'Jumlah pembayaran tidak boleh negatif';
    }
  }

  // Validasi BA Type
  if (!baData.baType) {
    errors.baType = 'Tipe BA harus dipilih';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Validasi file attachment
 */
export const validateBAAttachment = (file) => {
  const errors = [];

  // Check file size (max 10MB)
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    errors.push('Ukuran file maksimal 10MB');
  }

  // Check file type
  const allowedTypes = [
    'application/pdf',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];
  
  if (!allowedTypes.includes(file.type)) {
    errors.push('Format file tidak didukung. Gunakan PDF, JPG, PNG, atau DOC');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Sanitize BA data sebelum submit
 */
export const sanitizeBAData = (baData) => {
  return {
    ...baData,
    baNumber: baData.baNumber?.trim(),
    workDescription: baData.workDescription?.trim(),
    completionPercentage: Number(baData.completionPercentage),
    paymentAmount: baData.paymentAmount ? Number(baData.paymentAmount) : null,
    notes: baData.notes?.trim() || ''
  };
};
