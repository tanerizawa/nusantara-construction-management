/**
 * Sample Journal Entries Seeder
 * Creates test data for financial reports
 */

const { models } = require('../models');
const { JournalEntry, JournalEntryLine, ChartOfAccounts } = models;
const crypto = require('crypto');

// Helper function to generate UUID
function generateUUID() {
  return crypto.randomUUID();
}

class JournalEntriesSeeder {
  
  async seedSampleEntries() {
    try {
      console.log('🌱 Starting journal entries seeding...');

      // Get some accounts for seeding
      const accounts = await ChartOfAccounts.findAll({
        where: {
          is_active: true
        },
        order: [['account_code', 'ASC']]
      });

      if (accounts.length === 0) {
        throw new Error('No chart of accounts found. Please seed chart of accounts first.');
      }

      // Find specific accounts
      const kasBank = accounts.find(acc => acc.accountCode === '1101');
      const piutangUsaha = accounts.find(acc => acc.accountCode === '1102');
      const pendapatanKontrak = accounts.find(acc => acc.accountCode === '4101');
      const bebanMaterial = accounts.find(acc => acc.accountCode === '5101');
      const bebanTenagaKerja = accounts.find(acc => acc.accountCode === '5102');
      const hutangUsaha = accounts.find(acc => acc.accountCode === '2101');

      if (!kasBank || !pendapatanKontrak || !bebanMaterial) {
        throw new Error('Required accounts not found. Please check chart of accounts seeding.');
      }

      // Sample journal entries for construction company
      const sampleEntries = [
        {
          id: generateUUID(),
          entryNumber: 'JE-2025-001',
          entryDate: new Date('2025-01-15'),
          description: 'Kontrak proyek konstruksi ABC - termin 1',
          status: 'POSTED',
          createdBy: 'USER-001',
          postedBy: 'USER-001',
          postedAt: new Date('2025-01-15'),
          lines: [
            {
              id: generateUUID(),
              accountId: piutangUsaha.id,
              lineNumber: 1,
              description: 'Piutang termin 1 - Proyek ABC',
              debitAmount: 500000000, // 500 juta
              creditAmount: 0,
              projectId: 'PROJ-001'
            },
            {
              id: generateUUID(),
              accountId: pendapatanKontrak.id,
              lineNumber: 2,
              description: 'Pendapatan kontrak - Proyek ABC',
              debitAmount: 0,
              creditAmount: 500000000,
              projectId: 'PROJ-001'
            }
          ]
        },
        {
          id: generateUUID(),
          entryNumber: 'JE-2025-002',
          entryDate: new Date('2025-01-20'),
          description: 'Penerimaan pembayaran termin 1',
          status: 'POSTED',
          createdBy: 'USER-001',
          postedBy: 'USER-001',
          postedAt: new Date('2025-01-20'),
          lines: [
            {
              id: generateUUID(),
              accountId: kasBank.id,
              lineNumber: 1,
              description: 'Penerimaan kas dari owner',
              debitAmount: 500000000,
              creditAmount: 0,
              projectId: 'PROJ-001'
            },
            {
              id: generateUUID(),
              accountId: piutangUsaha.id,
              lineNumber: 2,
              description: 'Pelunasan piutang termin 1',
              debitAmount: 0,
              creditAmount: 500000000,
              projectId: 'PROJ-001'
            }
          ]
        },
        {
          id: generateUUID(),
          entryNumber: 'JE-2025-003',
          entryDate: new Date('2025-02-01'),
          description: 'Pembelian material konstruksi',
          status: 'POSTED',
          createdBy: 'USER-001',
          postedBy: 'USER-001',
          postedAt: new Date('2025-02-01'),
          lines: [
            {
              id: generateUUID(),
              accountId: bebanMaterial.id,
              lineNumber: 1,
              description: 'Semen, besi, bata untuk proyek ABC',
              debitAmount: 200000000, // 200 juta
              creditAmount: 0,
              projectId: 'PROJ-001'
            },
            {
              id: generateUUID(),
              accountId: hutangUsaha.id,
              lineNumber: 2,
              description: 'Hutang material ke supplier',
              debitAmount: 0,
              creditAmount: 200000000,
              projectId: 'PROJ-001'
            }
          ]
        },
        {
          id: generateUUID(),
          entryNumber: 'JE-2025-004',
          entryDate: new Date('2025-02-15'),
          description: 'Pembayaran gaji tenaga kerja',
          status: 'POSTED',
          createdBy: 'USER-001',
          postedBy: 'USER-001',
          postedAt: new Date('2025-02-15'),
          lines: [
            {
              id: generateUUID(),
              accountId: bebanTenagaKerja.id,
              lineNumber: 1,
              description: 'Gaji tukang dan mandor',
              debitAmount: 150000000, // 150 juta
              creditAmount: 0,
              projectId: 'PROJ-001'
            },
            {
              id: generateUUID(),
              accountId: kasBank.id,
              lineNumber: 2,
              description: 'Pembayaran gaji cash',
              debitAmount: 0,
              creditAmount: 150000000,
              projectId: 'PROJ-001'
            }
          ]
        },
        {
          id: generateUUID(),
          entryNumber: 'JE-2025-005',
          entryDate: new Date('2025-03-01'),
          description: 'Kontrak proyek konstruksi DEF - termin 1',
          status: 'POSTED',
          createdBy: 'USER-001',
          postedBy: 'USER-001',
          postedAt: new Date('2025-03-01'),
          lines: [
            {
              id: generateUUID(),
              accountId: piutangUsaha.id,
              lineNumber: 1,
              description: 'Piutang termin 1 - Proyek DEF',
              debitAmount: 750000000, // 750 juta
              creditAmount: 0,
              projectId: 'PROJ-002'
            },
            {
              id: generateUUID(),
              accountId: pendapatanKontrak.id,
              lineNumber: 2,
              description: 'Pendapatan kontrak - Proyek DEF',
              debitAmount: 0,
              creditAmount: 750000000,
              projectId: 'PROJ-002'
            }
          ]
        }
      ];

      // Create journal entries with their lines
      for (const entryData of sampleEntries) {
        const { lines, ...journalEntryData } = entryData;
        
        // Calculate totals
        const totalDebit = lines.reduce((sum, line) => sum + line.debitAmount, 0);
        const totalCredit = lines.reduce((sum, line) => sum + line.creditAmount, 0);
        
        // Create journal entry
        const journalEntry = await JournalEntry.create({
          ...journalEntryData,
          totalDebit,
          totalCredit
        });

        // Create journal entry lines
        for (const lineData of lines) {
          await JournalEntryLine.create({
            ...lineData,
            journalEntryId: journalEntry.id
          });
        }

        console.log(`✅ Created journal entry: ${journalEntry.entryNumber}`);
      }

      console.log('🎉 Journal entries seeding completed successfully!');
      
      // Show summary
      const totalEntries = await JournalEntry.count();
      const totalLines = await JournalEntryLine.count();
      
      // Simple revenue calculation without join
      const revenueLines = await JournalEntryLine.findAll({
        attributes: ['credit_amount'],
        include: [{
          model: ChartOfAccounts,
          as: 'account',
          where: { account_type: 'REVENUE' },
          attributes: []
        }]
      });
      
      const totalRevenue = revenueLines.reduce((sum, line) => sum + parseFloat(line.creditAmount || 0), 0);

      console.log(`📊 Seeding Summary:`);
      console.log(`   - Total Journal Entries: ${totalEntries}`);
      console.log(`   - Total Journal Lines: ${totalLines}`);
      console.log(`   - Total Revenue: Rp ${totalRevenue.toLocaleString('id-ID')}`);

      return {
        success: true,
        summary: {
          totalEntries,
          totalLines,
          totalRevenue
        }
      };

    } catch (error) {
      console.error('❌ Error seeding journal entries:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Clear all journal entries (for development)
  async clearJournalEntries() {
    try {
      console.log('🗑️  Clearing journal entries...');
      await JournalEntryLine.destroy({ where: {} });
      await JournalEntry.destroy({ where: {} });
      console.log('✅ Journal entries cleared');
      return { success: true };
    } catch (error) {
      console.error('❌ Error clearing journal entries:', error);
      return { success: false, error: error.message };
    }
  }
}

module.exports = new JournalEntriesSeeder();
