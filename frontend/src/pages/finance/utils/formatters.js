/**
 * Finance Formatters Utility
 * Formatting functions for financial data display
 */

/**
 * Format currency to Indonesian Rupiah
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return "Rp 0";
  }

  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Format number with thousand separators
 * @param {number} number - Number to format
 * @returns {string} Formatted number string
 */
export const formatNumber = (number) => {
  if (number === null || number === undefined || isNaN(number)) {
    return "0";
  }

  return new Intl.NumberFormat("id-ID").format(number);
};

/**
 * Format date to Indonesian format
 * @param {string|Date} date - Date to format
 * @param {boolean} includeTime - Include time in output
 * @returns {string} Formatted date string
 */
export const formatDate = (date, includeTime = false) => {
  if (!date) return "-";

  const dateObj = typeof date === "string" ? new Date(date) : date;

  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    ...(includeTime && {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };

  return new Intl.DateTimeFormat("id-ID", options).format(dateObj);
};

/**
 * Format date to short format (DD/MM/YYYY)
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date string
 */
export const formatDateShort = (date) => {
  if (!date) return "-";

  const dateObj = typeof date === "string" ? new Date(date) : date;
  const day = String(dateObj.getDate()).padStart(2, "0");
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const year = dateObj.getFullYear();

  return `${day}/${month}/${year}`;
};

/**
 * Format period (YYYY-MM) to readable format
 * @param {string} period - Period in YYYY-MM format
 * @returns {string} Formatted period string
 */
export const formatPeriod = (period) => {
  if (!period) return "-";

  const [year, month] = period.split("-");
  const monthNames = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  return `${monthNames[parseInt(month) - 1]} ${year}`;
};

/**
 * Convert Chart of Accounts to CSV format
 * @param {Array} accounts - Array of account objects
 * @returns {string} CSV formatted string
 */
export const convertCOAToCSV = (accounts) => {
  const headers = [
    "Account Code",
    "Account Name",
    "Account Type",
    "Account Sub Type",
    "Level",
    "Normal Balance",
    "Description",
    "Construction Specific",
    "VAT Applicable",
    "Status",
  ];
  const rows = [headers.join(",")];

  const flattenAccounts = (accountList, parentLevel = 0) => {
    accountList.forEach((account) => {
      const row = [
        `"${account.accountCode}"`,
        `"${account.accountName}"`,
        `"${account.accountType}"`,
        `"${account.accountSubType || ""}"`,
        account.level,
        `"${account.normalBalance}"`,
        `"${account.description || ""}"`,
        account.constructionSpecific ? "Yes" : "No",
        account.vatApplicable ? "Yes" : "No",
        account.isActive ? "Active" : "Inactive",
      ];
      rows.push(row.join(","));

      if (account.SubAccounts && account.SubAccounts.length > 0) {
        flattenAccounts(account.SubAccounts, parentLevel + 1);
      }
    });
  };

  flattenAccounts(accounts);
  return rows.join("\n");
};

/**
 * Get transaction type label
 * @param {string} type - Transaction type (income/expense)
 * @returns {string} Readable label
 */
export const getTransactionTypeLabel = (type) => {
  const labels = {
    income: "Pendapatan",
    expense: "Pengeluaran",
  };
  return labels[type] || type;
};

/**
 * Get transaction status badge class
 * @param {string} status - Transaction status
 * @returns {string} CSS class name
 */
export const getTransactionStatusClass = (status) => {
  const classes = {
    completed: "bg-green-100 text-green-800",
    pending: "bg-yellow-100 text-yellow-800",
    cancelled: "bg-red-100 text-red-800",
  };
  return classes[status] || "bg-gray-100 text-gray-800";
};

/**
 * Get payment method label
 * @param {string} method - Payment method code
 * @returns {string} Readable label
 */
export const getPaymentMethodLabel = (method) => {
  const labels = {
    bank_transfer: "Transfer Bank",
    cash: "Tunai",
    check: "Cek",
    credit_card: "Kartu Kredit",
    debit_card: "Kartu Debit",
    e_wallet: "E-Wallet",
  };
  return labels[method] || method;
};

/**
 * Get tax type label
 * @param {string} type - Tax type code
 * @returns {string} Readable label
 */
export const getTaxTypeLabel = (type) => {
  const labels = {
    pajak_penghasilan: "Pajak Penghasilan (PPh)",
    pajak_pertambahan_nilai: "Pajak Pertambahan Nilai (PPN)",
    pajak_bumi_bangunan: "Pajak Bumi dan Bangunan (PBB)",
    bpjs_kesehatan: "BPJS Kesehatan",
    bpjs_ketenagakerjaan: "BPJS Ketenagakerjaan",
  };
  return labels[type] || type;
};
