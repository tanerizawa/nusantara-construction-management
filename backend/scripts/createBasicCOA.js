/**
 * Create Basic COA Structure
 * Script untuk membuat akun-akun basic inti yang mencakup semua tipe akun
 * Sesuai standar PSAK untuk industri konstruksi
 */

const { models } = require('../models');
const { ChartOfAccounts } = models;

// Warna untuk console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  red: '\x1b[31m'
};

// Basic Chart of Accounts Structure
const BASIC_COA_STRUCTURE = [
  // ==================== ASSET (1xxx) ====================
  {
    id: 'COA-1000',
    account_code: '1000',
    account_name: 'ASET',
    account_type: 'ASSET',
    account_sub_type: 'CONTROL_ACCOUNT',
    parent_account_id: null,
    level: 1,
    normal_balance: 'DEBIT',
    is_control_account: true,
    construction_specific: false,
    description: 'Akun kontrol utama untuk semua aset perusahaan'
  },
  
  // Aset Lancar (Current Assets)
  {
    id: 'COA-1100',
    account_code: '1100',
    account_name: 'Aset Lancar',
    account_type: 'ASSET',
    account_sub_type: 'CURRENT_ASSET',
    parent_account_id: 'COA-1000',
    level: 2,
    normal_balance: 'DEBIT',
    is_control_account: true,
    construction_specific: false,
    description: 'Aset yang dapat dicairkan dalam waktu kurang dari 1 tahun'
  },
  {
    id: 'COA-1101',
    account_code: '1101',
    account_name: 'Kas & Bank',
    account_type: 'ASSET',
    account_sub_type: 'CASH_AND_BANK',
    parent_account_id: 'COA-1100',
    level: 3,
    normal_balance: 'DEBIT',
    is_control_account: false,
    construction_specific: false,
    description: 'Kas dan rekening bank perusahaan'
  },
  {
    id: 'COA-1101-01',
    account_code: '1101.01',
    account_name: 'Kas Kecil',
    account_type: 'ASSET',
    account_sub_type: 'CASH_AND_BANK',
    parent_account_id: 'COA-1101',
    level: 4,
    normal_balance: 'DEBIT',
    is_control_account: false,
    construction_specific: false,
    description: 'Kas kecil untuk pengeluaran operasional harian'
  },
  {
    id: 'COA-1101-02',
    account_code: '1101.02',
    account_name: 'Bank',
    account_type: 'ASSET',
    account_sub_type: 'CASH_AND_BANK',
    parent_account_id: 'COA-1101',
    level: 4,
    normal_balance: 'DEBIT',
    is_control_account: false,
    construction_specific: false,
    description: 'Rekening bank perusahaan'
  },
  {
    id: 'COA-1102',
    account_code: '1102',
    account_name: 'Piutang Usaha',
    account_type: 'ASSET',
    account_sub_type: 'RECEIVABLES',
    parent_account_id: 'COA-1100',
    level: 3,
    normal_balance: 'DEBIT',
    is_control_account: false,
    construction_specific: true,
    project_cost_center: true,
    description: 'Piutang dari pelanggan proyek konstruksi'
  },
  {
    id: 'COA-1103',
    account_code: '1103',
    account_name: 'Piutang Retensi',
    account_type: 'ASSET',
    account_sub_type: 'RECEIVABLES',
    parent_account_id: 'COA-1100',
    level: 3,
    normal_balance: 'DEBIT',
    is_control_account: false,
    construction_specific: true,
    project_cost_center: true,
    description: 'Piutang retensi dari proyek konstruksi'
  },
  {
    id: 'COA-1104',
    account_code: '1104',
    account_name: 'Persediaan Material',
    account_type: 'ASSET',
    account_sub_type: 'INVENTORY',
    parent_account_id: 'COA-1100',
    level: 3,
    normal_balance: 'DEBIT',
    is_control_account: false,
    construction_specific: true,
    description: 'Persediaan material konstruksi'
  },
  
  // Aset Tetap (Fixed Assets)
  {
    id: 'COA-1200',
    account_code: '1200',
    account_name: 'Aset Tetap',
    account_type: 'ASSET',
    account_sub_type: 'FIXED_ASSET',
    parent_account_id: 'COA-1000',
    level: 2,
    normal_balance: 'DEBIT',
    is_control_account: true,
    construction_specific: false,
    description: 'Aset tetap berwujud dengan masa manfaat lebih dari 1 tahun'
  },
  {
    id: 'COA-1201',
    account_code: '1201',
    account_name: 'Peralatan Konstruksi',
    account_type: 'ASSET',
    account_sub_type: 'FIXED_ASSET',
    parent_account_id: 'COA-1200',
    level: 3,
    normal_balance: 'DEBIT',
    is_control_account: false,
    construction_specific: true,
    description: 'Alat berat dan peralatan konstruksi'
  },
  {
    id: 'COA-1202',
    account_code: '1202',
    account_name: 'Kendaraan',
    account_type: 'ASSET',
    account_sub_type: 'FIXED_ASSET',
    parent_account_id: 'COA-1200',
    level: 3,
    normal_balance: 'DEBIT',
    is_control_account: false,
    construction_specific: false,
    description: 'Kendaraan operasional perusahaan'
  },
  {
    id: 'COA-1203',
    account_code: '1203',
    account_name: 'Akumulasi Penyusutan',
    account_type: 'ASSET',
    account_sub_type: 'ACCUMULATED_DEPRECIATION',
    parent_account_id: 'COA-1200',
    level: 3,
    normal_balance: 'CREDIT',
    is_control_account: false,
    construction_specific: false,
    description: 'Akumulasi penyusutan aset tetap (kontra akun)'
  },

  // ==================== LIABILITY (2xxx) ====================
  {
    id: 'COA-2000',
    account_code: '2000',
    account_name: 'KEWAJIBAN',
    account_type: 'LIABILITY',
    account_sub_type: 'CONTROL_ACCOUNT',
    parent_account_id: null,
    level: 1,
    normal_balance: 'CREDIT',
    is_control_account: true,
    construction_specific: false,
    description: 'Akun kontrol utama untuk semua kewajiban perusahaan'
  },
  
  // Kewajiban Lancar
  {
    id: 'COA-2100',
    account_code: '2100',
    account_name: 'Kewajiban Lancar',
    account_type: 'LIABILITY',
    account_sub_type: 'CURRENT_LIABILITY',
    parent_account_id: 'COA-2000',
    level: 2,
    normal_balance: 'CREDIT',
    is_control_account: true,
    construction_specific: false,
    description: 'Kewajiban yang jatuh tempo dalam waktu kurang dari 1 tahun'
  },
  {
    id: 'COA-2101',
    account_code: '2101',
    account_name: 'Hutang Usaha',
    account_type: 'LIABILITY',
    account_sub_type: 'PAYABLES',
    parent_account_id: 'COA-2100',
    level: 3,
    normal_balance: 'CREDIT',
    is_control_account: false,
    construction_specific: false,
    description: 'Hutang kepada supplier dan vendor'
  },
  {
    id: 'COA-2102',
    account_code: '2102',
    account_name: 'Hutang Retensi',
    account_type: 'LIABILITY',
    account_sub_type: 'PAYABLES',
    parent_account_id: 'COA-2100',
    level: 3,
    normal_balance: 'CREDIT',
    is_control_account: false,
    construction_specific: true,
    description: 'Hutang retensi kepada subkontraktor'
  },
  {
    id: 'COA-2103',
    account_code: '2103',
    account_name: 'Uang Muka Proyek',
    account_type: 'LIABILITY',
    account_sub_type: 'UNEARNED_REVENUE',
    parent_account_id: 'COA-2100',
    level: 3,
    normal_balance: 'CREDIT',
    is_control_account: false,
    construction_specific: true,
    project_cost_center: true,
    description: 'Uang muka yang diterima dari pemberi kerja'
  },
  {
    id: 'COA-2104',
    account_code: '2104',
    account_name: 'Hutang Pajak',
    account_type: 'LIABILITY',
    account_sub_type: 'TAX_PAYABLE',
    parent_account_id: 'COA-2100',
    level: 3,
    normal_balance: 'CREDIT',
    is_control_account: false,
    construction_specific: false,
    tax_deductible: true,
    description: 'Hutang pajak PPh, PPN, PPh 21/23'
  },
  
  // Kewajiban Jangka Panjang
  {
    id: 'COA-2200',
    account_code: '2200',
    account_name: 'Kewajiban Jangka Panjang',
    account_type: 'LIABILITY',
    account_sub_type: 'LONG_TERM_LIABILITY',
    parent_account_id: 'COA-2000',
    level: 2,
    normal_balance: 'CREDIT',
    is_control_account: true,
    construction_specific: false,
    description: 'Kewajiban yang jatuh tempo lebih dari 1 tahun'
  },
  {
    id: 'COA-2201',
    account_code: '2201',
    account_name: 'Hutang Bank Jangka Panjang',
    account_type: 'LIABILITY',
    account_sub_type: 'LONG_TERM_DEBT',
    parent_account_id: 'COA-2200',
    level: 3,
    normal_balance: 'CREDIT',
    is_control_account: false,
    construction_specific: false,
    description: 'Pinjaman bank jangka panjang'
  },

  // ==================== EQUITY (3xxx) ====================
  {
    id: 'COA-3000',
    account_code: '3000',
    account_name: 'EKUITAS',
    account_type: 'EQUITY',
    account_sub_type: 'CONTROL_ACCOUNT',
    parent_account_id: null,
    level: 1,
    normal_balance: 'CREDIT',
    is_control_account: true,
    construction_specific: false,
    description: 'Akun kontrol utama untuk modal dan ekuitas pemilik'
  },
  {
    id: 'COA-3100',
    account_code: '3100',
    account_name: 'Modal Saham',
    account_type: 'EQUITY',
    account_sub_type: 'CAPITAL_STOCK',
    parent_account_id: 'COA-3000',
    level: 2,
    normal_balance: 'CREDIT',
    is_control_account: false,
    construction_specific: false,
    description: 'Modal dasar perusahaan'
  },
  {
    id: 'COA-3200',
    account_code: '3200',
    account_name: 'Laba Ditahan',
    account_type: 'EQUITY',
    account_sub_type: 'RETAINED_EARNINGS',
    parent_account_id: 'COA-3000',
    level: 2,
    normal_balance: 'CREDIT',
    is_control_account: false,
    construction_specific: false,
    description: 'Laba tahun berjalan dan tahun sebelumnya'
  },
  {
    id: 'COA-3300',
    account_code: '3300',
    account_name: 'Laba Tahun Berjalan',
    account_type: 'EQUITY',
    account_sub_type: 'CURRENT_YEAR_EARNINGS',
    parent_account_id: 'COA-3000',
    level: 2,
    normal_balance: 'CREDIT',
    is_control_account: false,
    construction_specific: false,
    description: 'Laba/rugi tahun berjalan'
  },

  // ==================== REVENUE (4xxx) ====================
  {
    id: 'COA-4000',
    account_code: '4000',
    account_name: 'PENDAPATAN',
    account_type: 'REVENUE',
    account_sub_type: 'CONTROL_ACCOUNT',
    parent_account_id: null,
    level: 1,
    normal_balance: 'CREDIT',
    is_control_account: true,
    construction_specific: false,
    description: 'Akun kontrol utama untuk semua pendapatan'
  },
  {
    id: 'COA-4100',
    account_code: '4100',
    account_name: 'Pendapatan Proyek',
    account_type: 'REVENUE',
    account_sub_type: 'PROJECT_REVENUE',
    parent_account_id: 'COA-4000',
    level: 2,
    normal_balance: 'CREDIT',
    is_control_account: false,
    construction_specific: true,
    project_cost_center: true,
    vat_applicable: true,
    description: 'Pendapatan dari proyek konstruksi'
  },
  {
    id: 'COA-4200',
    account_code: '4200',
    account_name: 'Pendapatan Lain-lain',
    account_type: 'REVENUE',
    account_sub_type: 'OTHER_REVENUE',
    parent_account_id: 'COA-4000',
    level: 2,
    normal_balance: 'CREDIT',
    is_control_account: false,
    construction_specific: false,
    description: 'Pendapatan di luar operasional utama'
  },

  // ==================== EXPENSE (5xxx) ====================
  {
    id: 'COA-5000',
    account_code: '5000',
    account_name: 'BEBAN',
    account_type: 'EXPENSE',
    account_sub_type: 'CONTROL_ACCOUNT',
    parent_account_id: null,
    level: 1,
    normal_balance: 'DEBIT',
    is_control_account: true,
    construction_specific: false,
    description: 'Akun kontrol utama untuk semua beban'
  },
  
  // Beban Langsung Proyek (Direct Costs)
  {
    id: 'COA-5100',
    account_code: '5100',
    account_name: 'Beban Langsung Proyek',
    account_type: 'EXPENSE',
    account_sub_type: 'DIRECT_COST',
    parent_account_id: 'COA-5000',
    level: 2,
    normal_balance: 'DEBIT',
    is_control_account: true,
    construction_specific: true,
    description: 'Beban yang langsung terkait dengan proyek konstruksi'
  },
  {
    id: 'COA-5101',
    account_code: '5101',
    account_name: 'Beban Material',
    account_type: 'EXPENSE',
    account_sub_type: 'MATERIAL_COST',
    parent_account_id: 'COA-5100',
    level: 3,
    normal_balance: 'DEBIT',
    is_control_account: false,
    construction_specific: true,
    project_cost_center: true,
    description: 'Biaya material konstruksi'
  },
  {
    id: 'COA-5102',
    account_code: '5102',
    account_name: 'Beban Upah Tenaga Kerja',
    account_type: 'EXPENSE',
    account_sub_type: 'LABOR_COST',
    parent_account_id: 'COA-5100',
    level: 3,
    normal_balance: 'DEBIT',
    is_control_account: false,
    construction_specific: true,
    project_cost_center: true,
    tax_deductible: true,
    description: 'Upah tenaga kerja konstruksi'
  },
  {
    id: 'COA-5103',
    account_code: '5103',
    account_name: 'Beban Subkontraktor',
    account_type: 'EXPENSE',
    account_sub_type: 'SUBCONTRACTOR_COST',
    parent_account_id: 'COA-5100',
    level: 3,
    normal_balance: 'DEBIT',
    is_control_account: false,
    construction_specific: true,
    project_cost_center: true,
    description: 'Biaya subkontraktor'
  },
  {
    id: 'COA-5104',
    account_code: '5104',
    account_name: 'Beban Peralatan',
    account_type: 'EXPENSE',
    account_sub_type: 'EQUIPMENT_COST',
    parent_account_id: 'COA-5100',
    level: 3,
    normal_balance: 'DEBIT',
    is_control_account: false,
    construction_specific: true,
    project_cost_center: true,
    description: 'Biaya sewa dan operasional peralatan'
  },
  
  // Beban Operasional
  {
    id: 'COA-5200',
    account_code: '5200',
    account_name: 'Beban Operasional',
    account_type: 'EXPENSE',
    account_sub_type: 'OPERATING_EXPENSE',
    parent_account_id: 'COA-5000',
    level: 2,
    normal_balance: 'DEBIT',
    is_control_account: true,
    construction_specific: false,
    description: 'Beban operasional perusahaan'
  },
  {
    id: 'COA-5201',
    account_code: '5201',
    account_name: 'Beban Gaji Karyawan',
    account_type: 'EXPENSE',
    account_sub_type: 'SALARY_EXPENSE',
    parent_account_id: 'COA-5200',
    level: 3,
    normal_balance: 'DEBIT',
    is_control_account: false,
    construction_specific: false,
    tax_deductible: true,
    description: 'Gaji karyawan tetap'
  },
  {
    id: 'COA-5202',
    account_code: '5202',
    account_name: 'Beban Sewa Kantor',
    account_type: 'EXPENSE',
    account_sub_type: 'RENT_EXPENSE',
    parent_account_id: 'COA-5200',
    level: 3,
    normal_balance: 'DEBIT',
    is_control_account: false,
    construction_specific: false,
    tax_deductible: true,
    description: 'Sewa kantor dan fasilitas'
  },
  {
    id: 'COA-5203',
    account_code: '5203',
    account_name: 'Beban Utilitas',
    account_type: 'EXPENSE',
    account_sub_type: 'UTILITY_EXPENSE',
    parent_account_id: 'COA-5200',
    level: 3,
    normal_balance: 'DEBIT',
    is_control_account: false,
    construction_specific: false,
    tax_deductible: true,
    description: 'Listrik, air, telepon, internet'
  },
  {
    id: 'COA-5204',
    account_code: '5204',
    account_name: 'Beban Penyusutan',
    account_type: 'EXPENSE',
    account_sub_type: 'DEPRECIATION_EXPENSE',
    parent_account_id: 'COA-5200',
    level: 3,
    normal_balance: 'DEBIT',
    is_control_account: false,
    construction_specific: false,
    tax_deductible: true,
    description: 'Beban penyusutan aset tetap'
  },
  
  // Beban Lain-lain
  {
    id: 'COA-5300',
    account_code: '5300',
    account_name: 'Beban Lain-lain',
    account_type: 'EXPENSE',
    account_sub_type: 'OTHER_EXPENSE',
    parent_account_id: 'COA-5000',
    level: 2,
    normal_balance: 'DEBIT',
    is_control_account: false,
    construction_specific: false,
    description: 'Beban di luar operasional utama'
  },
  {
    id: 'COA-5301',
    account_code: '5301',
    account_name: 'Beban Bunga',
    account_type: 'EXPENSE',
    account_sub_type: 'INTEREST_EXPENSE',
    parent_account_id: 'COA-5300',
    level: 3,
    normal_balance: 'DEBIT',
    is_control_account: false,
    construction_specific: false,
    tax_deductible: true,
    description: 'Beban bunga pinjaman'
  }
];

/**
 * Create basic COA structure
 */
async function createBasicCOA() {
  console.log(`\n${colors.blue}========================================`);
  console.log('  CREATE BASIC CHART OF ACCOUNTS');
  console.log(`========================================${colors.reset}\n`);

  let created = 0;
  let skipped = 0;
  let errors = 0;

  for (const accountData of BASIC_COA_STRUCTURE) {
    try {
      // Check if account already exists
      const existing = await ChartOfAccounts.findOne({
        where: { account_code: accountData.account_code }
      });

      if (existing) {
        console.log(`${colors.yellow}⊙ SKIP${colors.reset} ${accountData.account_code} - ${accountData.account_name} (already exists)`);
        skipped++;
        continue;
      }

      // Create account
      // Convert snake_case to camelCase for Sequelize
      await ChartOfAccounts.create({
        id: accountData.id,
        accountCode: accountData.account_code,
        accountName: accountData.account_name,
        accountType: accountData.account_type,
        accountSubType: accountData.account_sub_type,
        parentAccountId: accountData.parent_account_id,
        level: accountData.level,
        normalBalance: accountData.normal_balance,
        isActive: true,
        isControlAccount: accountData.is_control_account || false,
        constructionSpecific: accountData.construction_specific || false,
        taxDeductible: accountData.tax_deductible || false,
        vatApplicable: accountData.vat_applicable || false,
        projectCostCenter: accountData.project_cost_center || false,
        description: accountData.description || null,
        notes: accountData.notes || null,
        currentBalance: 0,
        subsidiaryId: accountData.subsidiary_id || null
      });

      const indent = '  '.repeat(accountData.level - 1);
      console.log(`${colors.green}✓ CREATE${colors.reset} ${indent}${accountData.account_code} - ${accountData.account_name}`);
      created++;

    } catch (error) {
      console.log(`${colors.red}✗ ERROR${colors.reset} ${accountData.account_code} - ${error.message}`);
      errors++;
    }
  }

  console.log(`\n${colors.blue}========================================`);
  console.log('  SUMMARY');
  console.log(`========================================${colors.reset}`);
  console.log(`${colors.green}✓ Created:${colors.reset} ${created} accounts`);
  console.log(`${colors.yellow}⊙ Skipped:${colors.reset} ${skipped} accounts`);
  console.log(`${colors.red}✗ Errors:${colors.reset}  ${errors} accounts`);
  console.log(`${colors.blue}Total:${colors.reset}    ${BASIC_COA_STRUCTURE.length} accounts\n`);

  return { created, skipped, errors };
}

// Run if executed directly
if (require.main === module) {
  createBasicCOA()
    .then(() => {
      console.log(`${colors.green}✓ Script completed successfully${colors.reset}\n`);
      process.exit(0);
    })
    .catch(error => {
      console.error(`${colors.red}✗ Script failed:${colors.reset}`, error);
      process.exit(1);
    });
}

module.exports = { createBasicCOA, BASIC_COA_STRUCTURE };
