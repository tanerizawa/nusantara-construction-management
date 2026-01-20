/**
 * Seed Sample Journal Entries
 * Run this to populate database with sample financial data
 */

const JournalEntriesSeeder = require('./seeders/journalEntriesSeeder');

async function runSeeder() {
  try {
    console.log('🚀 Starting journal entries seeding process...');
    
    const result = await JournalEntriesSeeder.seedSampleEntries();
    
    if (result.success) {
      console.log('✅ Seeding completed successfully!');
      console.log('📊 Summary:', result.summary);
    } else {
      console.error('❌ Seeding failed:', result.error);
      process.exit(1);
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
    process.exit(1);
  }
}

runSeeder();
