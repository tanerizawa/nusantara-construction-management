/**
 * Tax Transaction Seeder
 * Creates sample transactions for tax reporting testing
 */

const { models } = require('../models');
const { JournalEntry, JournalEntryLine, ChartOfAccounts } = models;
const { v4: uuidv4 } = require('uuid');

async function seedTaxTransactions() {
  try {
    console.log('🔄 Starting tax transaction seeding...');

    // Get all chart of accounts
    const accounts = await ChartOfAccounts.findAll({
      where: { isActive: true }
    });

    if (!accounts || accounts.length === 0) {
      throw new Error('No chart of accounts found. Please seed chart of accounts first.');
    }

    // Find specific accounts  
    const kasBank = accounts.find(acc => acc.accountCode === '1101');
    const piutangUsaha = accounts.find(acc => acc.accountCode === '1102');
    const pendapatanKontrak = accounts.find(acc => acc.accountCode === '4101');
    const bebanMaterial = accounts.find(acc => acc.accountCode === '5101');
    const hutangUsaha = accounts.find(acc => acc.accountCode === '2101');

    if (!kasBank || !pendapatanKontrak || !bebanMaterial) {
      console.error('❌ Required accounts not found');
      console.log('Available accounts:', accounts.map(a => `${a.accountCode} - ${a.accountName}`));
      return;
    }

    const generateUUID = () => uuidv4();

    // Sample tax transactions
    const sampleEntries = [
      {
        id: generateUUID(),
        entryNumber: 'TAX-001',
        entryDate: new Date('2025-01-15'),
        description: 'Construction Invoice with PPN 11%',
        status: 'POSTED',
        createdBy: 'seeder',
        postedBy: 'seeder',
        postedAt: new Date('2025-01-15'),
        lines: [
          {
            id: generateUUID(),
            accountId: piutangUsaha.id,
            lineNumber: 1,
            description: 'Invoice termin 2 (include PPN)',
            debitAmount: 555000000, // 500M + 55M VAT
            creditAmount: 0,
            projectId: 'karawang-001'
          },
          {
            id: generateUUID(),
            accountId: pendapatanKontrak.id,
            lineNumber: 2, 
            description: 'Revenue (base amount)',
            debitAmount: 0,
            creditAmount: 500000000,
            projectId: 'karawang-001'
          }
        ]
      }
    ];

    // Process entries
    for (const entryData of sampleEntries) {
      const { lines, ...entryInfo } = entryData;
      
      const totalDebit = lines.reduce((sum, line) => sum + line.debitAmount, 0);
      const totalCredit = lines.reduce((sum, line) => sum + line.creditAmount, 0);
      
      await JournalEntry.create({
        ...entryInfo,
        totalDebit,
        totalCredit,
        subsidiaryId: 'nusantara-karawang'
      });

      for (const line of lines) {
        await JournalEntryLine.create({
          ...line,
          journalEntryId: entryInfo.id
        });
      }
    }

    console.log('✅ Tax transaction seeding completed!');
    console.log('📊 Created: Construction Invoice Rp 500M (+ PPN Rp 55M)');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding tax transactions:', error);
    process.exit(1);
  }
}

module.exports = { seedTaxTransactions };

if (require.main === module) {
  seedTaxTransactions();
}
