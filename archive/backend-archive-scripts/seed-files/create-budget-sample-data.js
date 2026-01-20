/**
 * Create Sample Data for Budget Planning
 * Creates real database entries for testing budget functionality
 */

const { sequelize } = require('./config/database');
require('./models'); // Load all models

async function createSampleData() {
  try {
    console.log('🔧 Starting database sync and sample data creation...');
    
    // Sync database (create tables)
    await sequelize.sync({ force: true });
    console.log('✅ Database tables created');

    // Create Chart of Accounts
    const chartOfAccountsData = [
      // Assets
      { 
        id: 'COA-1100', account_code: '1100', account_name: 'Kas', 
        account_type: 'ASSET', normal_balance: 'DEBIT', 
        construction_specific: true, project_cost_center: true 
      },
      { 
        id: 'COA-1200', account_code: '1200', account_name: 'Piutang Usaha', 
        account_type: 'ASSET', normal_balance: 'DEBIT', 
        construction_specific: true, project_cost_center: true 
      },
      { 
        id: 'COA-1300', account_code: '1300', account_name: 'Persediaan Material', 
        account_type: 'ASSET', normal_balance: 'DEBIT', 
        construction_specific: true, project_cost_center: true 
      },
      { 
        id: 'COA-1400', account_code: '1400', account_name: 'Peralatan Konstruksi', 
        account_type: 'ASSET', normal_balance: 'DEBIT', 
        construction_specific: true, project_cost_center: true 
      },
      
      // Liabilities
      { 
        id: 'COA-2100', account_code: '2100', account_name: 'Utang Usaha', 
        account_type: 'LIABILITY', normal_balance: 'CREDIT', 
        construction_specific: true, project_cost_center: true 
      },
      { 
        id: 'COA-2200', account_code: '2200', account_name: 'Utang Bank', 
        account_type: 'LIABILITY', normal_balance: 'CREDIT', 
        construction_specific: false, project_cost_center: false 
      },
      
      // Equity
      { 
        id: 'COA-3100', account_code: '3100', account_name: 'Modal Disetor', 
        account_type: 'EQUITY', normal_balance: 'CREDIT', 
        construction_specific: false, project_cost_center: false 
      },
      { 
        id: 'COA-3200', account_code: '3200', account_name: 'Laba Ditahan', 
        account_type: 'EQUITY', normal_balance: 'CREDIT', 
        construction_specific: false, project_cost_center: false 
      },
      
      // Revenue
      { 
        id: 'COA-4100', account_code: '4100', account_name: 'Pendapatan Konstruksi', 
        account_type: 'REVENUE', normal_balance: 'CREDIT', 
        construction_specific: true, project_cost_center: true 
      },
      { 
        id: 'COA-4200', account_code: '4200', account_name: 'Pendapatan Lain-lain', 
        account_type: 'REVENUE', normal_balance: 'CREDIT', 
        construction_specific: false, project_cost_center: false 
      },
      
      // Expenses
      { 
        id: 'COA-5100', account_code: '5100', account_name: 'Beban Material', 
        account_type: 'EXPENSE', normal_balance: 'DEBIT', 
        construction_specific: true, project_cost_center: true 
      },
      { 
        id: 'COA-5200', account_code: '5200', account_name: 'Beban Tenaga Kerja', 
        account_type: 'EXPENSE', normal_balance: 'DEBIT', 
        construction_specific: true, project_cost_center: true 
      },
      { 
        id: 'COA-5300', account_code: '5300', account_name: 'Beban Peralatan', 
        account_type: 'EXPENSE', normal_balance: 'DEBIT', 
        construction_specific: true, project_cost_center: true 
      },
      { 
        id: 'COA-5400', account_code: '5400', account_name: 'Beban Subkontraktor', 
        account_type: 'EXPENSE', normal_balance: 'DEBIT', 
        construction_specific: true, project_cost_center: true 
      },
      { 
        id: 'COA-5500', account_code: '5500', account_name: 'Beban Overhead', 
        account_type: 'EXPENSE', normal_balance: 'DEBIT', 
        construction_specific: true, project_cost_center: true 
      },
      { 
        id: 'COA-5600', account_code: '5600', account_name: 'Beban Administrasi', 
        account_type: 'EXPENSE', normal_balance: 'DEBIT', 
        construction_specific: true, project_cost_center: true 
      },
      { 
        id: 'COA-5700', account_code: '5700', account_name: 'Beban Asuransi', 
        account_type: 'EXPENSE', normal_balance: 'DEBIT', 
        construction_specific: true, project_cost_center: true 
      }
    ];

    for (const account of chartOfAccountsData) {
      await sequelize.query(`
        INSERT INTO chart_of_accounts (
          id, account_code, account_name, account_type, normal_balance, 
          construction_specific, project_cost_center, created_at, updated_at
        ) VALUES (
          '${account.id}', '${account.account_code}', '${account.account_name}', 
          '${account.account_type}', '${account.normal_balance}', 
          ${account.construction_specific}, ${account.project_cost_center}, 
          NOW(), NOW()
        )
      `);
    }
    console.log('✅ Chart of Accounts created');

    // Create Subsidiaries
      await sequelize.query(`
        INSERT INTO subsidiaries (id, name, code, address, "createdAt", "updatedAt")
        VALUES 
          ('SUB-001', 'PT Nusantara Konstruksi', 'NK001', '{"street":"Jl. Thamrin No. 123","city":"Jakarta Pusat","province":"DKI Jakarta","postal_code":"10230"}', NOW(), NOW()),
          ('SUB-002', 'PT Jaya Konstruksi', 'JK002', '{"street":"Jl. Pemuda No. 45","city":"Surabaya","province":"Jawa Timur","postal_code":"60271"}', NOW(), NOW())
      `);
      console.log('✅ Subsidiaries created');

    // Create Users
    await sequelize.query(`
      INSERT INTO users (id, username, email, password, role, "createdAt", "updatedAt")
      VALUES 
        ('USR-001', 'adminyk', 'admin@nusantara.co.id', '$2b$10$1234567890', 'admin', NOW(), NOW()),
        ('USR-002', 'manager1', 'manager1@nusantara.co.id', '$2b$10$1234567890', 'project_manager', NOW(), NOW()),
        ('USR-003', 'finance1', 'finance@nusantara.co.id', '$2b$10$1234567890', 'finance_manager', NOW(), NOW())
    `);
    console.log('✅ Users created');

    // Create Projects
    await sequelize.query(`
      INSERT INTO projects (
        id, name, description, client_name, location, budget, status, 
        start_date, end_date, project_manager_id, subsidiary_id, created_by, "createdAt", "updatedAt"
      ) VALUES 
        ('PROJ-001', 'Pembangunan Gedung Perkantoran A', 'Konstruksi gedung 10 lantai di Jakarta', 'PT Maju Sejahtera', 
         '{"street":"Jl. Sudirman","city":"Jakarta Selatan","province":"DKI Jakarta"}', 5000000000, 'active', 
         '2025-01-01', '2025-12-31', 'USR-002', 'SUB-001', 'USR-001', NOW(), NOW()),
        ('PROJ-002', 'Jembatan Layang B', 'Konstruksi jembatan layang sepanjang 2km', 'Pemerintah Kota', 
         '{"street":"Jl. Raya Darmo","city":"Surabaya","province":"Jawa Timur"}', 8000000000, 'active', 
         '2025-02-01', '2025-11-30', 'USR-002', 'SUB-001', 'USR-001', NOW(), NOW()),
        ('PROJ-003', 'Perumahan Subsidi C', 'Pembangunan 100 unit rumah subsidi', 'PT Perumahan Rakyat', 
         '{"street":"Jl. Ahmad Yani","city":"Surabaya","province":"Jawa Timur"}', 3000000000, 'active', 
         '2025-03-01', '2026-02-28', 'USR-002', 'SUB-002', 'USR-001', NOW(), NOW())
    `);
    console.log('✅ Projects created');

    // Create Journal Entries - Construction Activities
    const journalEntries = [
      // Project PROJ-001 - Gedung Perkantoran
      // Material purchases
      {
        id: 'JE-001',
        entry_number: 'JE-2025-001',
        entry_date: '2025-02-15',
        description: 'Pembelian semen dan besi untuk pondasi',
        project_id: 'PROJ-001',
        subsidiary_id: 'SUB-001',
        created_by: 'USR-002',
        entries: [
          { account_id: 'COA-1300', debit: 850000000, credit: 0, line_number: 1 }, // Persediaan Material
          { account_id: 'COA-1100', debit: 0, credit: 850000000, line_number: 2 }  // Kas
        ]
      },
      // Labor costs
      {
        id: 'JE-002',
        entry_number: 'JE-2025-002',
        entry_date: '2025-02-20',
        description: 'Upah pekerja konstruksi bulan Februari',
        project_id: 'PROJ-001',
        subsidiary_id: 'SUB-001',
        created_by: 'USR-002',
        entries: [
          { account_id: 'COA-5200', debit: 675000000, credit: 0, line_number: 1 }, // Beban Tenaga Kerja
          { account_id: 'COA-1100', debit: 0, credit: 675000000, line_number: 2 }  // Kas
        ]
      },
      // Equipment rental
      {
        id: 'JE-003',
        entry_number: 'JE-2025-003',
        entry_date: '2025-02-25',
        description: 'Sewa crane dan excavator bulan Februari',
        project_id: 'PROJ-001',
        subsidiary_id: 'SUB-001',
        created_by: 'USR-002',
        entries: [
          { account_id: 'COA-5300', debit: 425000000, credit: 0, line_number: 1 }, // Beban Peralatan
          { account_id: 'COA-1100', debit: 0, credit: 425000000, line_number: 2 }  // Kas
        ]
      },
      // Subcontractor payments
      {
        id: 'JE-004',
        entry_number: 'JE-2025-004',
        entry_date: '2025-03-01',
        description: 'Pembayaran subkontraktor plumbing',
        project_id: 'PROJ-001',
        subsidiary_id: 'SUB-001',
        created_by: 'USR-002',
        entries: [
          { account_id: 'COA-5400', debit: 300000000, credit: 0, line_number: 1 }, // Beban Subkontraktor
          { account_id: 'COA-1100', debit: 0, credit: 300000000, line_number: 2 }  // Kas
        ]
      },
      // Overhead costs
      {
        id: 'JE-005',
        entry_number: 'JE-2025-005',
        entry_date: '2025-03-05',
        description: 'Beban overhead proyek (listrik, air, keamanan)',
        project_id: 'PROJ-001',
        subsidiary_id: 'SUB-001',
        created_by: 'USR-002',
        entries: [
          { account_id: 'COA-5500', debit: 125000000, credit: 0, line_number: 1 }, // Beban Overhead
          { account_id: 'COA-1100', debit: 0, credit: 125000000, line_number: 2 }  // Kas
        ]
      },
      // Administrative costs
      {
        id: 'JE-006',
        entry_number: 'JE-2025-006',
        entry_date: '2025-03-10',
        description: 'Beban administrasi proyek',
        project_id: 'PROJ-001',
        subsidiary_id: 'SUB-001',
        created_by: 'USR-002',
        entries: [
          { account_id: 'COA-5600', debit: 75000000, credit: 0, line_number: 1 }, // Beban Administrasi
          { account_id: 'COA-1100', debit: 0, credit: 75000000, line_number: 2 }  // Kas
        ]
      },
      // Insurance costs
      {
        id: 'JE-007',
        entry_number: 'JE-2025-007',
        entry_date: '2025-03-15',
        description: 'Premi asuransi konstruksi',
        project_id: 'PROJ-001',
        subsidiary_id: 'SUB-001',
        created_by: 'USR-002',
        entries: [
          { account_id: 'COA-5700', debit: 50000000, credit: 0, line_number: 1 }, // Beban Asuransi
          { account_id: 'COA-1100', debit: 0, credit: 50000000, line_number: 2 }  // Kas
        ]
      },
      
      // Project PROJ-002 - Jembatan Layang
      {
        id: 'JE-008',
        entry_number: 'JE-2025-008',
        entry_date: '2025-03-20',
        description: 'Pembelian material beton dan baja untuk jembatan',
        project_id: 'PROJ-002',
        subsidiary_id: 'SUB-001',
        created_by: 'USR-002',
        entries: [
          { account_id: 'COA-1300', debit: 1200000000, credit: 0, line_number: 1 }, // Persediaan Material
          { account_id: 'COA-1100', debit: 0, credit: 1200000000, line_number: 2 }  // Kas
        ]
      },
      {
        id: 'JE-009',
        entry_number: 'JE-2025-009',
        entry_date: '2025-03-25',
        description: 'Upah pekerja jembatan bulan Maret',
        project_id: 'PROJ-002',
        subsidiary_id: 'SUB-001',
        created_by: 'USR-002',
        entries: [
          { account_id: 'COA-5200', debit: 950000000, credit: 0, line_number: 1 }, // Beban Tenaga Kerja
          { account_id: 'COA-1100', debit: 0, credit: 950000000, line_number: 2 }  // Kas
        ]
      },

      // Project PROJ-003 - Perumahan Subsidi
      {
        id: 'JE-010',
        entry_number: 'JE-2025-010',
        entry_date: '2025-04-01',
        description: 'Pembelian material untuk perumahan',
        project_id: 'PROJ-003',
        subsidiary_id: 'SUB-002',
        created_by: 'USR-003',
        entries: [
          { account_id: 'COA-1300', debit: 600000000, credit: 0, line_number: 1 }, // Persediaan Material
          { account_id: 'COA-1100', debit: 0, credit: 600000000, line_number: 2 }  // Kas
        ]
      },

      // Revenue recognition
      {
        id: 'JE-011',
        entry_number: 'JE-2025-011',
        entry_date: '2025-04-10',
        description: 'Pengakuan pendapatan progress konstruksi 30%',
        project_id: 'PROJ-001',
        subsidiary_id: 'SUB-001',
        created_by: 'USR-002',
        entries: [
          { account_id: 'COA-1200', debit: 1500000000, credit: 0, line_number: 1 }, // Piutang Usaha
          { account_id: 'COA-4100', debit: 0, credit: 1500000000, line_number: 2 }  // Pendapatan Konstruksi
        ]
      }
    ];

    // Insert journal entries
    for (const entry of journalEntries) {
      // Calculate totals
      const totalDebit = entry.entries.reduce((sum, line) => sum + line.debit, 0);
      const totalCredit = entry.entries.reduce((sum, line) => sum + line.credit, 0);
      
      // Insert main journal entry
      await sequelize.query(`
        INSERT INTO journal_entries (
          id, entry_number, entry_date, description, project_id, subsidiary_id, 
          created_by, total_debit, total_credit, status, "createdAt", "updatedAt"
        ) VALUES (
          '${entry.id}', '${entry.entry_number}', '${entry.entry_date}', '${entry.description}', 
          '${entry.project_id}', '${entry.subsidiary_id}', '${entry.created_by}', 
          ${totalDebit}, ${totalCredit}, 'POSTED', NOW(), NOW()
        )
      `);

      // Insert journal entry lines
      for (const line of entry.entries) {
        await sequelize.query(`
          INSERT INTO journal_entry_lines (
            id, journal_entry_id, account_id, debit_amount, credit_amount,
            line_number, project_id, "createdAt", "updatedAt"
          ) VALUES (
            '${entry.id}-${line.line_number}', '${entry.id}', '${line.account_id}', 
            ${line.debit}, ${line.credit}, ${line.line_number}, '${entry.project_id}',
            NOW(), NOW()
          )
        `);
      }
    }
    console.log('✅ Journal entries created');

    // Summary
    console.log('\n📊 Sample Data Summary:');
    console.log('- Chart of Accounts: 17 accounts');
    console.log('- Subsidiaries: 2 companies');
    console.log('- Projects: 3 construction projects');
    console.log('- Journal Entries: 11 transactions');
    console.log('- Users: 3 users');
    console.log('\n💰 Financial Data Summary:');
    console.log('- Total Material Costs: Rp 2,650,000,000');
    console.log('- Total Labor Costs: Rp 1,625,000,000');
    console.log('- Total Equipment Costs: Rp 425,000,000');
    console.log('- Total Other Costs: Rp 550,000,000');
    console.log('- Total Revenue Recognized: Rp 1,500,000,000');

    console.log('\n✅ Sample data creation completed successfully!');
    
  } catch (error) {
    console.error('❌ Error creating sample data:', error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  createSampleData()
    .then(() => {
      console.log('✅ Script completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Script failed:', error);
      process.exit(1);
    });
}

module.exports = createSampleData;
