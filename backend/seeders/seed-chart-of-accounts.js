const ChartOfAccounts = require('../models/ChartOfAccounts');
const coaData = require('../data/construction-coa.json');

async function seedChartOfAccounts() {
  try {
    console.log('🌱 Seeding Chart of Accounts...');
    
    // Clear existing data
    await ChartOfAccounts.destroy({ where: {} });
    
    // Insert new data
    const accounts = coaData.chartOfAccounts.map(account => ({
      ...account,
      isActive: true,
      vatApplicable: account.vatApplicable || false,
      taxDeductible: account.taxDeductible !== undefined ? account.taxDeductible : null,
      projectCostCenter: account.projectCostCenter || false,
      constructionSpecific: account.constructionSpecific || false,
      isControlAccount: account.isControlAccount || false
    }));
    
    await ChartOfAccounts.bulkCreate(accounts);
    
    console.log(`✅ Successfully seeded ${accounts.length} chart of accounts`);
    
    return accounts;
  } catch (error) {
    console.error('❌ Error seeding chart of accounts:', error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  seedChartOfAccounts()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

module.exports = seedChartOfAccounts;
