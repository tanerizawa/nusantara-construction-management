/**
 * Account Templates Configuration
 * 
 * Pre-defined account structures for common construction industry accounts.
 * Users can quickly create standard accounts using these templates.
 * 
 * Structure follows PSAK (Indonesian Financial Accounting Standards)
 * optimized for construction/project-based businesses.
 */

const ACCOUNT_TEMPLATES = {
  /**
   * Cash & Bank Accounts (1101.xx)
   * Common bank and cash accounts
   */
  CASH_BANK: {
    id: 'CASH_BANK',
    name: 'Kas & Bank',
    description: 'Akun kas kecil dan rekening bank perusahaan',
    category: 'ASSET',
    parentCode: '1101',
    icon: '💵',
    accounts: [
      {
        code: '1101.01',
        name: 'Kas Kecil',
        description: 'Kas kecil untuk pengeluaran operasional harian',
        subType: 'CASH_AND_BANK',
        normalBalance: 'DEBIT',
        isActive: true
      },
      {
        code: '1101.02',
        name: 'Bank BCA',
        description: 'Rekening Bank Central Asia',
        subType: 'CASH_AND_BANK',
        normalBalance: 'DEBIT',
        isActive: true
      },
      {
        code: '1101.03',
        name: 'Bank Mandiri',
        description: 'Rekening Bank Mandiri',
        subType: 'CASH_AND_BANK',
        normalBalance: 'DEBIT',
        isActive: true
      },
      {
        code: '1101.04',
        name: 'Bank BNI',
        description: 'Rekening Bank Negara Indonesia',
        subType: 'CASH_AND_BANK',
        normalBalance: 'DEBIT',
        isActive: true
      },
      {
        code: '1101.05',
        name: 'Bank BRI',
        description: 'Rekening Bank Rakyat Indonesia',
        subType: 'CASH_AND_BANK',
        normalBalance: 'DEBIT',
        isActive: true
      }
    ]
  },

  /**
   * Accounts Receivable (1102.xx)
   */
  RECEIVABLES: {
    id: 'RECEIVABLES',
    name: 'Piutang',
    description: 'Piutang usaha dan piutang lainnya',
    category: 'ASSET',
    parentCode: '1102',
    icon: '📄',
    accounts: [
      {
        code: '1102.01',
        name: 'Piutang Usaha',
        description: 'Piutang dari penjualan jasa konstruksi',
        subType: 'ACCOUNTS_RECEIVABLE',
        normalBalance: 'DEBIT',
        constructionSpecific: true,
        isActive: true
      },
      {
        code: '1102.02',
        name: 'Piutang Retensi',
        description: 'Piutang retensi proyek konstruksi',
        subType: 'ACCOUNTS_RECEIVABLE',
        normalBalance: 'DEBIT',
        constructionSpecific: true,
        isActive: true
      },
      {
        code: '1102.03',
        name: 'Piutang Termin',
        description: 'Piutang pembayaran termin proyek',
        subType: 'ACCOUNTS_RECEIVABLE',
        normalBalance: 'DEBIT',
        constructionSpecific: true,
        isActive: true
      }
    ]
  },

  /**
   * Inventory Accounts (1103.xx)
   */
  INVENTORY: {
    id: 'INVENTORY',
    name: 'Persediaan',
    description: 'Persediaan bahan bangunan dan material',
    category: 'ASSET',
    parentCode: '1103',
    icon: '📦',
    accounts: [
      {
        code: '1103.01',
        name: 'Persediaan Bahan Bangunan',
        description: 'Bahan bangunan di gudang',
        subType: 'INVENTORY',
        normalBalance: 'DEBIT',
        constructionSpecific: true,
        isActive: true
      },
      {
        code: '1103.02',
        name: 'Persediaan Semen',
        description: 'Stok semen',
        subType: 'INVENTORY',
        normalBalance: 'DEBIT',
        constructionSpecific: true,
        isActive: true
      },
      {
        code: '1103.03',
        name: 'Persediaan Besi & Baja',
        description: 'Stok besi dan baja',
        subType: 'INVENTORY',
        normalBalance: 'DEBIT',
        constructionSpecific: true,
        isActive: true
      }
    ]
  },

  /**
   * Fixed Assets (12xx)
   */
  FIXED_ASSETS: {
    id: 'FIXED_ASSETS',
    name: 'Aset Tetap',
    description: 'Tanah, bangunan, kendaraan, dan peralatan',
    category: 'ASSET',
    parentCode: '1200',
    icon: '🏢',
    accounts: [
      {
        code: '1201',
        name: 'Tanah',
        description: 'Kepemilikan tanah perusahaan',
        subType: 'FIXED_ASSET',
        normalBalance: 'DEBIT',
        isControlAccount: false,
        isActive: true
      },
      {
        code: '1202',
        name: 'Bangunan',
        description: 'Bangunan kantor dan gudang',
        subType: 'FIXED_ASSET',
        normalBalance: 'DEBIT',
        isControlAccount: false,
        isActive: true
      },
      {
        code: '1203',
        name: 'Kendaraan',
        description: 'Kendaraan operasional perusahaan',
        subType: 'FIXED_ASSET',
        normalBalance: 'DEBIT',
        isControlAccount: false,
        isActive: true
      },
      {
        code: '1204',
        name: 'Mesin & Peralatan',
        description: 'Mesin dan peralatan konstruksi',
        subType: 'FIXED_ASSET',
        normalBalance: 'DEBIT',
        constructionSpecific: true,
        isControlAccount: false,
        isActive: true
      },
      {
        code: '1205',
        name: 'Alat Berat',
        description: 'Excavator, crane, dan alat berat lainnya',
        subType: 'FIXED_ASSET',
        normalBalance: 'DEBIT',
        constructionSpecific: true,
        isControlAccount: false,
        isActive: true
      }
    ]
  },

  /**
   * Direct Costs / Cost of Revenue (51xx)
   * Construction-specific direct project costs
   */
  DIRECT_COSTS: {
    id: 'DIRECT_COSTS',
    name: 'Beban Langsung Proyek',
    description: 'Biaya langsung yang dialokasikan ke proyek konstruksi',
    category: 'EXPENSE',
    parentCode: '5100',
    icon: '🏗️',
    accounts: [
      {
        code: '5101',
        name: 'Bahan Langsung',
        description: 'Biaya bahan bangunan langsung untuk proyek',
        subType: 'DIRECT_COST',
        normalBalance: 'DEBIT',
        constructionSpecific: true,
        projectCostCenter: true,
        taxDeductible: true,
        isControlAccount: false,
        isActive: true
      },
      {
        code: '5102',
        name: 'Tenaga Kerja Langsung',
        description: 'Upah pekerja langsung proyek',
        subType: 'DIRECT_COST',
        normalBalance: 'DEBIT',
        constructionSpecific: true,
        projectCostCenter: true,
        taxDeductible: true,
        isControlAccount: false,
        isActive: true
      },
      {
        code: '5103',
        name: 'Subkontraktor',
        description: 'Biaya subkontraktor',
        subType: 'DIRECT_COST',
        normalBalance: 'DEBIT',
        constructionSpecific: true,
        projectCostCenter: true,
        taxDeductible: true,
        isControlAccount: false,
        isActive: true
      },
      {
        code: '5104',
        name: 'Sewa Alat Berat',
        description: 'Biaya sewa alat berat untuk proyek',
        subType: 'DIRECT_COST',
        normalBalance: 'DEBIT',
        constructionSpecific: true,
        projectCostCenter: true,
        taxDeductible: true,
        isControlAccount: false,
        isActive: true
      }
    ]
  },

  /**
   * Operating Expenses (52xx)
   * General office and administrative expenses
   */
  OPERATING_EXPENSES: {
    id: 'OPERATING_EXPENSES',
    name: 'Beban Operasional',
    description: 'Beban operasional kantor dan administrasi',
    category: 'EXPENSE',
    parentCode: '5200',
    icon: '📊',
    accounts: [
      {
        code: '5201',
        name: 'Gaji & Upah Karyawan',
        description: 'Gaji karyawan tetap dan honor',
        subType: 'OPERATING_EXPENSE',
        normalBalance: 'DEBIT',
        projectCostCenter: false,
        taxDeductible: true,
        isControlAccount: false,
        isActive: true
      },
      {
        code: '5202',
        name: 'Sewa Kantor',
        description: 'Biaya sewa kantor dan gudang',
        subType: 'OPERATING_EXPENSE',
        normalBalance: 'DEBIT',
        projectCostCenter: false,
        taxDeductible: true,
        isControlAccount: false,
        isActive: true
      },
      {
        code: '5203',
        name: 'Listrik & Air',
        description: 'Biaya listrik dan air kantor',
        subType: 'OPERATING_EXPENSE',
        normalBalance: 'DEBIT',
        projectCostCenter: false,
        taxDeductible: true,
        isControlAccount: false,
        isActive: true
      },
      {
        code: '5204',
        name: 'Telepon & Internet',
        description: 'Biaya telekomunikasi',
        subType: 'OPERATING_EXPENSE',
        normalBalance: 'DEBIT',
        projectCostCenter: false,
        taxDeductible: true,
        isControlAccount: false,
        isActive: true
      },
      {
        code: '5205',
        name: 'Bahan Bakar & Transportasi',
        description: 'BBM dan biaya transportasi',
        subType: 'OPERATING_EXPENSE',
        normalBalance: 'DEBIT',
        projectCostCenter: false,
        taxDeductible: true,
        isControlAccount: false,
        isActive: true
      },
      {
        code: '5206',
        name: 'Perlengkapan Kantor',
        description: 'ATK dan perlengkapan kantor',
        subType: 'OPERATING_EXPENSE',
        normalBalance: 'DEBIT',
        projectCostCenter: false,
        taxDeductible: true,
        isControlAccount: false,
        isActive: true
      },
      {
        code: '5207',
        name: 'Pemeliharaan & Perbaikan',
        description: 'Biaya pemeliharaan aset perusahaan',
        subType: 'OPERATING_EXPENSE',
        normalBalance: 'DEBIT',
        projectCostCenter: false,
        taxDeductible: true,
        isControlAccount: false,
        isActive: true
      }
    ]
  },

  /**
   * Revenue Accounts (41xx)
   */
  REVENUE: {
    id: 'REVENUE',
    name: 'Pendapatan',
    description: 'Pendapatan dari jasa konstruksi',
    category: 'REVENUE',
    parentCode: '4100',
    icon: '📈',
    accounts: [
      {
        code: '4101',
        name: 'Pendapatan Jasa Konstruksi',
        description: 'Pendapatan dari proyek konstruksi',
        subType: 'OPERATING_REVENUE',
        normalBalance: 'CREDIT',
        constructionSpecific: true,
        projectCostCenter: true,
        isControlAccount: false,
        isActive: true
      },
      {
        code: '4102',
        name: 'Pendapatan Konsultasi',
        description: 'Pendapatan dari jasa konsultasi',
        subType: 'OPERATING_REVENUE',
        normalBalance: 'CREDIT',
        constructionSpecific: true,
        isControlAccount: false,
        isActive: true
      }
    ]
  },

  /**
   * Liability Accounts (21xx)
   */
  LIABILITIES: {
    id: 'LIABILITIES',
    name: 'Kewajiban',
    description: 'Hutang usaha dan kewajiban lainnya',
    category: 'LIABILITY',
    parentCode: '2100',
    icon: '💰',
    accounts: [
      {
        code: '2101',
        name: 'Hutang Usaha',
        description: 'Hutang kepada supplier',
        subType: 'CURRENT_LIABILITY',
        normalBalance: 'CREDIT',
        isControlAccount: false,
        isActive: true
      },
      {
        code: '2102',
        name: 'Hutang Gaji',
        description: 'Hutang gaji karyawan',
        subType: 'CURRENT_LIABILITY',
        normalBalance: 'CREDIT',
        isControlAccount: false,
        isActive: true
      },
      {
        code: '2103',
        name: 'Hutang Pajak',
        description: 'Hutang pajak perusahaan',
        subType: 'CURRENT_LIABILITY',
        normalBalance: 'CREDIT',
        isControlAccount: false,
        isActive: true
      }
    ]
  }
};

/**
 * Get all template categories
 */
function getAllTemplates() {
  return Object.values(ACCOUNT_TEMPLATES);
}

/**
 * Get template by ID
 */
function getTemplateById(templateId) {
  return ACCOUNT_TEMPLATES[templateId] || null;
}

/**
 * Get templates by account type
 */
function getTemplatesByType(accountType) {
  return Object.values(ACCOUNT_TEMPLATES).filter(
    template => template.category === accountType
  );
}

/**
 * Get construction-specific templates
 */
function getConstructionTemplates() {
  return Object.values(ACCOUNT_TEMPLATES).filter(
    template => template.id === 'DIRECT_COSTS' || 
                template.id === 'INVENTORY' ||
                template.id === 'FIXED_ASSETS'
  );
}

/**
 * Get quick start templates (most commonly used)
 */
function getQuickStartTemplates() {
  return [
    ACCOUNT_TEMPLATES.CASH_BANK,
    ACCOUNT_TEMPLATES.DIRECT_COSTS,
    ACCOUNT_TEMPLATES.OPERATING_EXPENSES
  ];
}

module.exports = {
  ACCOUNT_TEMPLATES,
  getAllTemplates,
  getTemplateById,
  getTemplatesByType,
  getConstructionTemplates,
  getQuickStartTemplates
};
