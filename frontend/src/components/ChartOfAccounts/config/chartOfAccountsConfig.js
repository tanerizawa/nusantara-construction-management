export const CHART_OF_ACCOUNTS_CONFIG = {
  title: 'Chart of Accounts',
  subtitle: 'Bagan akun standar industri konstruksi sesuai PSAK - Real-time data',
  
  // API endpoints
  endpoints: {
    accounts: '/api/chart-of-accounts',
    hierarchy: '/api/coa/hierarchy',
    subsidiaries: '/api/subsidiaries'
  },
  
  // UI settings
  ui: {
    refreshInterval: 30000, // 30 seconds
    maxAccountLevel: 4,
    treeViewPadding: 24, // pixels per level
    animationDuration: 150
  },
  
  // Export settings
  export: {
    csvHeaders: [
      'Account Code',
      'Account Name', 
      'Account Type',
      'Sub Type',
      'Level',
      'Normal Balance',
      'Construction Specific',
      'Project Cost Center',
      'VAT Applicable',
      'Tax Deductible',
      'Description',
      'Status'
    ],
    filenameTemplate: 'chart-of-accounts-{date}.csv'
  },
  
  // Balance display settings
  balance: {
    currency: 'IDR',
    locale: 'id-ID',
    minimumFractionDigits: 0,
    showDebitCreditDetails: true
  },
  
  // Search and filter settings
  search: {
    placeholder: 'Cari nama akun atau kode...',
    minCharacters: 1,
    debounceMs: 300
  },
  
  // Modal settings
  modal: {
    maxWidth: '28rem', // Add account modal
    maxWidthLarge: '4xl', // Subsidiary modal
    maxHeight: '80vh',
    zIndex: 9999
  },
  
  // Colors and styling
  colors: {
    primary: '#0A84FF',
    success: '#32D74B',
    warning: '#FF9F0A',
    error: '#FF453A',
    purple: '#BF5AF2',
    background: '#2C2C2E',
    backgroundSecondary: '#1C1C1E',
    border: '#38383A',
    text: '#FFFFFF',
    textSecondary: '#98989D',
    textTertiary: '#636366'
  }
};

export default CHART_OF_ACCOUNTS_CONFIG;