/**
 * Finance Validators Utility
 * Validation functions for finance forms and data
 */

/**
 * Validate transaction form
 * @param {Object} formData - Transaction form data
 * @returns {Object} Validation result with isValid and errors
 */
export const validateTransactionForm = (formData) => {
  console.log('🔍 VALIDATOR - Starting validation for:', formData);
  
  const errors = {};

  // Type validation
  if (!formData.type) {
    console.log('❌ Type missing');
    errors.type = "Tipe transaksi harus dipilih";
  }

  // Category validation
  if (!formData.category || formData.category.trim() === "") {
    console.log('❌ Category missing or empty');
    errors.category = "Kategori harus diisi";
  }

  // Amount validation
  if (!formData.amount || formData.amount === "" || formData.amount === "0") {
    console.log('❌ Amount missing or zero');
    errors.amount = "Jumlah harus diisi";
  } else if (parseFloat(formData.amount) <= 0) {
    console.log('❌ Amount <= 0');
    errors.amount = "Jumlah harus lebih dari 0";
  } else if (isNaN(parseFloat(formData.amount))) {
    console.log('❌ Amount not a number');
    errors.amount = "Jumlah harus berupa angka";
  }

  // Description validation
  if (!formData.description || formData.description.trim() === "") {
    console.log('❌ Description missing or empty');
    errors.description = "Deskripsi harus diisi";
  } else if (formData.description.length < 5) {
    console.log('❌ Description too short:', formData.description.length, 'chars');
    errors.description = "Deskripsi minimal 5 karakter";
  } else if (formData.description.length > 500) {
    console.log('❌ Description too long:', formData.description.length, 'chars');
    errors.description = "Deskripsi maksimal 500 karakter";
  }

  // Date validation
  if (!formData.date) {
    console.log('❌ Date missing');
    errors.date = "Tanggal harus diisi";
  } else {
    const dateObj = new Date(formData.date);
    const today = new Date();
    today.setHours(23, 59, 59, 999); // End of today

    if (isNaN(dateObj.getTime())) {
      console.log('❌ Date invalid format');
      errors.date = "Format tanggal tidak valid";
    } else if (dateObj > today) {
      console.log('❌ Date in future:', dateObj, 'vs today:', today);
      errors.date = "Tanggal tidak boleh di masa depan";
    }
  }

  // Account validation based on transaction type
  if (formData.type === 'expense' || formData.type === 'transfer') {
    if (!formData.accountFrom || formData.accountFrom.trim() === "") {
      console.log('❌ AccountFrom missing for', formData.type);
      errors.accountFrom = "Akun sumber harus dipilih";
    }
  }

  if (formData.type === 'income' || formData.type === 'transfer') {
    if (!formData.accountTo || formData.accountTo.trim() === "") {
      console.log('❌ AccountTo missing for', formData.type);
      errors.accountTo = "Akun tujuan harus dipilih";
    }
  }

  // Transfer-specific validation
  if (formData.type === 'transfer') {
    if (formData.accountFrom && formData.accountTo && formData.accountFrom === formData.accountTo) {
      console.log('❌ Transfer: same account', formData.accountFrom);
      errors.accountTo = "Akun tujuan harus berbeda dari akun sumber";
    }
  }

  // Reference number validation (optional but if provided should be valid)
  if (formData.referenceNumber && formData.referenceNumber.trim() !== "") {
    if (formData.referenceNumber.length < 3) {
      console.log('❌ Reference number too short');
      errors.referenceNumber = "Nomor referensi minimal 3 karakter";
    } else if (formData.referenceNumber.length > 50) {
      console.log('❌ Reference number too long');
      errors.referenceNumber = "Nomor referensi maksimal 50 karakter";
    }
  }

  console.log('🔍 VALIDATOR - Final errors:', errors);
  console.log('✅ VALIDATOR - Is Valid:', Object.keys(errors).length === 0);

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validate tax form
 * @param {Object} formData - Tax form data
 * @returns {Object} Validation result with isValid and errors
 */
export const validateTaxForm = (formData) => {
  const errors = {};

  // Type validation
  if (!formData.type) {
    errors.type = "Jenis pajak harus dipilih";
  }

  // Amount validation
  if (!formData.amount || formData.amount === "" || formData.amount === "0") {
    errors.amount = "Jumlah pajak harus diisi";
  } else if (parseFloat(formData.amount) <= 0) {
    errors.amount = "Jumlah pajak harus lebih dari 0";
  } else if (isNaN(parseFloat(formData.amount))) {
    errors.amount = "Jumlah pajak harus berupa angka";
  }

  // Period validation (YYYY-MM format)
  if (!formData.period) {
    errors.period = "Periode harus diisi";
  } else {
    const periodRegex = /^\d{4}-\d{2}$/;
    if (!periodRegex.test(formData.period)) {
      errors.period = "Format periode harus YYYY-MM";
    } else {
      const [year, month] = formData.period.split("-").map(Number);
      const currentYear = new Date().getFullYear();

      if (year < 2000 || year > currentYear + 1) {
        errors.period = `Tahun harus antara 2000 dan ${currentYear + 1}`;
      }

      if (month < 1 || month > 12) {
        errors.period = "Bulan harus antara 01 dan 12";
      }
    }
  }

  // Description validation
  if (formData.description && formData.description.length > 500) {
    errors.description = "Deskripsi maksimal 500 karakter";
  }

  // Payment date validation (optional)
  if (formData.paymentDate) {
    const dateObj = new Date(formData.paymentDate);
    if (isNaN(dateObj.getTime())) {
      errors.paymentDate = "Format tanggal pembayaran tidak valid";
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validate amount input
 * @param {string|number} amount - Amount to validate
 * @param {Object} options - Validation options
 * @returns {Object} Validation result
 */
export const validateAmount = (amount, options = {}) => {
  const {
    min = 0,
    max = Number.MAX_SAFE_INTEGER,
    allowZero = false,
    allowNegative = false,
  } = options;

  const errors = [];

  if (amount === null || amount === undefined || amount === "") {
    errors.push("Jumlah harus diisi");
    return { isValid: false, errors };
  }

  const numAmount = parseFloat(amount);

  if (isNaN(numAmount)) {
    errors.push("Jumlah harus berupa angka");
    return { isValid: false, errors };
  }

  if (!allowZero && numAmount === 0) {
    errors.push("Jumlah tidak boleh nol");
  }

  if (!allowNegative && numAmount < 0) {
    errors.push("Jumlah tidak boleh negatif");
  }

  if (numAmount < min) {
    errors.push(`Jumlah minimal ${min}`);
  }

  if (numAmount > max) {
    errors.push(`Jumlah maksimal ${max}`);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validate date range
 * @param {string} startDate - Start date
 * @param {string} endDate - End date
 * @returns {Object} Validation result
 */
export const validateDateRange = (startDate, endDate) => {
  const errors = {};

  if (!startDate) {
    errors.startDate = "Tanggal mulai harus diisi";
  }

  if (!endDate) {
    errors.endDate = "Tanggal akhir harus diisi";
  }

  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime())) {
      errors.startDate = "Format tanggal mulai tidak valid";
    }

    if (isNaN(end.getTime())) {
      errors.endDate = "Format tanggal akhir tidak valid";
    }

    if (start > end) {
      errors.dateRange =
        "Tanggal mulai tidak boleh lebih besar dari tanggal akhir";
    }

    // Check if range is not too large (max 1 year)
    const daysDiff = (end - start) / (1000 * 60 * 60 * 24);
    if (daysDiff > 365) {
      errors.dateRange = "Rentang tanggal maksimal 1 tahun";
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validate reference number format
 * @param {string} refNumber - Reference number
 * @param {string} prefix - Expected prefix (optional)
 * @returns {Object} Validation result
 */
export const validateReferenceNumber = (refNumber, prefix = "") => {
  const errors = [];

  if (!refNumber || refNumber.trim() === "") {
    return { isValid: true, errors }; // Optional field
  }

  const trimmed = refNumber.trim();

  if (trimmed.length < 3) {
    errors.push("Nomor referensi minimal 3 karakter");
  }

  if (trimmed.length > 50) {
    errors.push("Nomor referensi maksimal 50 karakter");
  }

  if (prefix && !trimmed.startsWith(prefix)) {
    errors.push(`Nomor referensi harus diawali dengan ${prefix}`);
  }

  // Check for invalid characters (only alphanumeric, dash, slash allowed)
  const validPattern = /^[A-Za-z0-9\-\/]+$/;
  if (!validPattern.test(trimmed)) {
    errors.push(
      "Nomor referensi hanya boleh mengandung huruf, angka, dash (-), dan slash (/)"
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validate category name
 * @param {string} category - Category name
 * @returns {Object} Validation result
 */
export const validateCategory = (category) => {
  const errors = [];

  if (!category || category.trim() === "") {
    errors.push("Kategori harus diisi");
    return { isValid: false, errors };
  }

  const trimmed = category.trim();

  if (trimmed.length < 2) {
    errors.push("Kategori minimal 2 karakter");
  }

  if (trimmed.length > 100) {
    errors.push("Kategori maksimal 100 karakter");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
