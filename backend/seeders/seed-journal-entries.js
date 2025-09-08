/**
 * Journal Entries Seeder
 * Creates sample double-entry transactions for construction industry
 */

const { JournalEntry, JournalEntryLine, ChartOfAccounts } = require('../models');

const sampleJournalEntries = [
  {
    entry_number: 'JE20250901001',
    entry_date: '2025-01-01',
    entry_type: 'OPENING',
    description: 'Opening Balance - Initial Capital and Bank Balance',
    reference_type: 'OPENING_BALANCE',
    reference_number: 'OB-2025-001',
    status: 'POSTED',
    posted_at: '2025-01-01',
    created_by: 'system',
    posted_by: 'system',
    lines: [
      {
        account_code: 'COA-1101',
        description: 'Opening bank balance',
        debit_amount: 500000000,
        credit_amount: 0
      },
      {
        account_code: 'COA-1201',
        description: 'Opening inventory balance',
        debit_amount: 100000000,
        credit_amount: 0
      },
      {
        account_code: 'COA-3101',
        description: 'Initial paid-up capital',
        debit_amount: 0,
        credit_amount: 600000000
      }
    ]
  },
  {
    entry_number: 'JE20250901002',
    entry_date: '2025-01-02',
    entry_type: 'PURCHASE',
    description: 'Purchase of Construction Materials',
    reference_type: 'PURCHASE_ORDER',
    reference_number: 'PO-2025-001',
    project_id: 1,
    status: 'POSTED',
    posted_at: '2025-01-02',
    created_by: 'procurement',
    posted_by: 'accounting',
    lines: [
      {
        account_code: 'COA-1201',
        description: 'Cement purchase - 1000 bags',
        debit_amount: 50000000,
        credit_amount: 0,
        cost_center: 'PROJECT-001'
      },
      {
        account_code: 'COA-1202',
        description: 'Steel bars purchase - 10 tons',
        debit_amount: 75000000,
        credit_amount: 0,
        cost_center: 'PROJECT-001'
      },
      {
        account_code: 'COA-1203',
        description: 'Sand purchase - 100 cubic meters',
        debit_amount: 15000000,
        credit_amount: 0,
        cost_center: 'PROJECT-001'
      },
      {
        account_code: 'COA-2203',
        description: 'VAT Input Tax 11%',
        debit_amount: 15400000,
        credit_amount: 0,
        tax_type: 'VAT_INPUT',
        tax_amount: 15400000
      },
      {
        account_code: 'COA-2101',
        description: 'Accounts payable to supplier',
        debit_amount: 0,
        credit_amount: 155400000
      }
    ]
  },
  {
    entry_number: 'JE20250901003',
    entry_date: '2025-01-03',
    entry_type: 'PAYROLL',
    description: 'Monthly Payroll - January 2025',
    reference_type: 'PAYROLL',
    reference_number: 'PAY-2025-01',
    status: 'POSTED',
    posted_at: '2025-01-03',
    created_by: 'hr',
    posted_by: 'accounting',
    lines: [
      {
        account_code: 'COA-5101',
        description: 'Direct labor wages',
        debit_amount: 150000000,
        credit_amount: 0,
        cost_center: 'DIRECT_LABOR'
      },
      {
        account_code: 'COA-5201',
        description: 'Administrative salaries',
        debit_amount: 80000000,
        credit_amount: 0,
        department: 'ADMIN'
      },
      {
        account_code: 'COA-2201',
        description: 'Employee income tax withheld',
        debit_amount: 0,
        credit_amount: 23000000,
        tax_type: 'INCOME_TAX'
      },
      {
        account_code: 'COA-2202',
        description: 'BPJS contributions payable',
        debit_amount: 0,
        credit_amount: 12000000
      },
      {
        account_code: 'COA-1101',
        description: 'Net payroll payment',
        debit_amount: 0,
        credit_amount: 195000000
      }
    ]
  },
  {
    entry_number: 'JE20250901004',
    entry_date: '2025-01-05',
    entry_type: 'REVENUE',
    description: 'Project Progress Billing - Project Alpha Phase 1',
    reference_type: 'INVOICE',
    reference_number: 'INV-2025-001',
    project_id: 1,
    status: 'POSTED',
    posted_at: '2025-01-05',
    created_by: 'project_manager',
    posted_by: 'accounting',
    lines: [
      {
        account_code: 'COA-1102',
        description: 'Project billing - Phase 1 completion 30%',
        debit_amount: 330000000,
        credit_amount: 0,
        cost_center: 'PROJECT-001'
      },
      {
        account_code: 'COA-4101',
        description: 'Construction revenue recognized',
        debit_amount: 0,
        credit_amount: 300000000,
        cost_center: 'PROJECT-001'
      },
      {
        account_code: 'COA-2204',
        description: 'VAT Output Tax 11%',
        debit_amount: 0,
        credit_amount: 30000000,
        tax_type: 'VAT_OUTPUT',
        tax_amount: 30000000
      }
    ]
  },
  {
    entry_number: 'JE20250901005',
    entry_date: '2025-01-07',
    entry_type: 'EXPENSE',
    description: 'Equipment Rental and Utilities',
    reference_type: 'EXPENSE_REPORT',
    reference_number: 'EXP-2025-001',
    status: 'POSTED',
    posted_at: '2025-01-07',
    created_by: 'site_manager',
    posted_by: 'accounting',
    lines: [
      {
        account_code: 'COA-5102',
        description: 'Excavator rental - 7 days',
        debit_amount: 35000000,
        credit_amount: 0,
        cost_center: 'EQUIPMENT'
      },
      {
        account_code: 'COA-5103',
        description: 'Electricity expense',
        debit_amount: 8000000,
        credit_amount: 0,
        department: 'OPERATIONS'
      },
      {
        account_code: 'COA-5104',
        description: 'Fuel and transportation',
        debit_amount: 12000000,
        credit_amount: 0,
        cost_center: 'LOGISTICS'
      },
      {
        account_code: 'COA-2203',
        description: 'VAT Input Tax 11%',
        debit_amount: 6050000,
        credit_amount: 0,
        tax_type: 'VAT_INPUT',
        tax_amount: 6050000
      },
      {
        account_code: 'COA-1101',
        description: 'Cash payment for expenses',
        debit_amount: 0,
        credit_amount: 61050000
      }
    ]
  }
];

const seedJournalEntries = async () => {
  try {
    console.log('🌱 Starting Journal Entries seeding...');
    
    // Get chart of accounts for mapping
    const accounts = await ChartOfAccounts.findAll({
      attributes: ['id', 'account_code']
    });
    
    const accountMap = {};
    accounts.forEach(account => {
      accountMap[account.account_code] = account.id;
    });

    let createdCount = 0;
    
    for (const entryData of sampleJournalEntries) {
      // Check if entry already exists
      const existingEntry = await JournalEntry.findOne({
        where: { entry_number: entryData.entry_number }
      });
      
      if (existingEntry) {
        console.log(`⚠️  Journal Entry ${entryData.entry_number} already exists, skipping...`);
        continue;
      }

      // Calculate totals
      let totalDebit = 0;
      let totalCredit = 0;
      
      entryData.lines.forEach(line => {
        totalDebit += line.debit_amount;
        totalCredit += line.credit_amount;
      });

      // Create journal entry
      const journalEntry = await JournalEntry.create({
        entry_number: entryData.entry_number,
        entry_date: entryData.entry_date,
        entry_type: entryData.entry_type,
        description: entryData.description,
        reference_type: entryData.reference_type,
        reference_number: entryData.reference_number,
        project_id: entryData.project_id,
        subsidiary_id: entryData.subsidiary_id,
        total_debit: totalDebit,
        total_credit: totalCredit,
        is_balanced: Math.abs(totalDebit - totalCredit) < 0.01,
        status: entryData.status,
        posted_at: entryData.posted_at,
        created_by: entryData.created_by,
        posted_by: entryData.posted_by
      });

      // Create journal entry lines
      for (let i = 0; i < entryData.lines.length; i++) {
        const line = entryData.lines[i];
        const accountId = accountMap[line.account_code];
        
        if (!accountId) {
          console.warn(`⚠️  Account code ${line.account_code} not found, skipping line...`);
          continue;
        }

        await JournalEntryLine.create({
          journal_entry_id: journalEntry.id,
          account_id: accountId,
          line_number: i + 1,
          description: line.description,
          debit_amount: line.debit_amount,
          credit_amount: line.credit_amount,
          project_id: line.project_id || entryData.project_id,
          cost_center: line.cost_center,
          department: line.department,
          tax_amount: line.tax_amount || 0,
          tax_type: line.tax_type
        });
      }

      createdCount++;
      console.log(`✅ Created Journal Entry: ${entryData.entry_number} - ${entryData.description}`);
    }

    console.log(`\n🎉 Journal Entries seeding completed!`);
    console.log(`📊 Created ${createdCount} new journal entries`);

    // Display summary
    const totalEntries = await JournalEntry.count();
    const totalLines = await JournalEntryLine.count();
    
    console.log(`\n📈 Database Summary:`);
    console.log(`   Total Journal Entries: ${totalEntries}`);
    console.log(`   Total Journal Lines: ${totalLines}`);

  } catch (error) {
    console.error('❌ Error seeding journal entries:', error);
    throw error;
  }
};

// Run seeder if called directly
if (require.main === module) {
  const { sequelize } = require('../config/database');
  
  (async () => {
    try {
      await sequelize.authenticate();
      console.log('✅ Database connection established');
      
      await seedJournalEntries();
      process.exit(0);
    } catch (error) {
      console.error('❌ Seeding failed:', error);
      process.exit(1);
    }
  })();
}

module.exports = { seedJournalEntries, sampleJournalEntries };
