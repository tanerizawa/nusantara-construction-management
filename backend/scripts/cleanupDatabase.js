/**
 * Database Cleanup Script
 * Membersihkan data orphan, redundant, duplikat, dan tidak valid
 */

const { models, sequelize } = require('../models');
const { ChartOfAccounts } = models;

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

/**
 * Find and remove orphaned accounts
 * (accounts with parent_account_id that doesn't exist)
 */
async function cleanOrphanedAccounts() {
  console.log(`\n${colors.cyan}=== Cleaning Orphaned Accounts ===${colors.reset}`);
  
  const accounts = await ChartOfAccounts.findAll({
    where: {
      parent_account_id: {
        [sequelize.Sequelize.Op.ne]: null
      }
    }
  });

  let orphanCount = 0;
  
  for (const account of accounts) {
    const parent = await ChartOfAccounts.findByPk(account.parentAccountId);
    
    if (!parent) {
      console.log(`${colors.red}✗ ORPHAN${colors.reset} ${account.accountCode} - ${account.accountName} (parent: ${account.parentAccountId} not found)`);
      
      // Delete orphaned account
      await account.destroy();
      orphanCount++;
    }
  }
  
  if (orphanCount === 0) {
    console.log(`${colors.green}✓ No orphaned accounts found${colors.reset}`);
  } else {
    console.log(`${colors.green}✓ Deleted ${orphanCount} orphaned accounts${colors.reset}`);
  }
  
  return orphanCount;
}

/**
 * Find and remove duplicate accounts
 * (same account_code)
 */
async function cleanDuplicateAccounts() {
  console.log(`\n${colors.cyan}=== Cleaning Duplicate Accounts ===${colors.reset}`);
  
  const duplicates = await sequelize.query(`
    SELECT account_code, COUNT(*) as count
    FROM chart_of_accounts
    GROUP BY account_code
    HAVING COUNT(*) > 1
  `, { type: sequelize.QueryTypes.SELECT });

  let dupCount = 0;
  
  for (const dup of duplicates) {
    console.log(`${colors.yellow}⚠ DUPLICATE${colors.reset} ${dup.account_code} (${dup.count} times)`);
    
    // Get all duplicates
    const accounts = await ChartOfAccounts.findAll({
      where: { accountCode: dup.account_code },
      order: [['createdAt', 'ASC']]
    });
    
    // Keep the first one (oldest), delete the rest
    for (let i = 1; i < accounts.length; i++) {
      console.log(`${colors.red}  ✗ DELETE${colors.reset} ${accounts[i].id} - ${accounts[i].accountName}`);
      await accounts[i].destroy();
      dupCount++;
    }
    
    console.log(`${colors.green}  ✓ KEEP${colors.reset} ${accounts[0].id} - ${accounts[0].accountName}`);
  }
  
  if (dupCount === 0) {
    console.log(`${colors.green}✓ No duplicate accounts found${colors.reset}`);
  } else {
    console.log(`${colors.green}✓ Deleted ${dupCount} duplicate accounts${colors.reset}`);
  }
  
  return dupCount;
}

/**
 * Find and fix redundant/invalid accounts
 */
async function cleanRedundantAccounts() {
  console.log(`\n${colors.cyan}=== Cleaning Redundant Accounts ===${colors.reset}`);
  
  let redundantCount = 0;
  
  // 1. Account with code "1101-10" and name "ASET" (invalid)
  const invalidAccount = await ChartOfAccounts.findOne({
    where: {
      accountCode: '1101-10',
      accountName: 'ASET'
    }
  });
  
  if (invalidAccount) {
    console.log(`${colors.red}✗ REDUNDANT${colors.reset} ${invalidAccount.accountCode} - ${invalidAccount.accountName} (invalid naming)`);
    await invalidAccount.destroy();
    redundantCount++;
  }
  
  // 2. Accounts with invalid level (level > 4 or level < 1)
  const invalidLevelAccounts = await ChartOfAccounts.findAll({
    where: {
      [sequelize.Sequelize.Op.or]: [
        { level: { [sequelize.Sequelize.Op.gt]: 4 } },
        { level: { [sequelize.Sequelize.Op.lt]: 1 } }
      ]
    }
  });
  
  for (const account of invalidLevelAccounts) {
    console.log(`${colors.red}✗ INVALID LEVEL${colors.reset} ${account.accountCode} - ${account.accountName} (level: ${account.level})`);
    await account.destroy();
    redundantCount++;
  }
  
  // 3. Level 1 accounts with parent (should not have parent)
  const level1WithParent = await ChartOfAccounts.findAll({
    where: {
      level: 1,
      parentAccountId: {
        [sequelize.Sequelize.Op.ne]: null
      }
    }
  });
  
  for (const account of level1WithParent) {
    console.log(`${colors.yellow}⚠ FIX${colors.reset} ${account.accountCode} - ${account.accountName} (level 1 should not have parent)`);
    await account.update({ parentAccountId: null });
    redundantCount++;
  }
  
  // 4. Level 2+ accounts without parent (should have parent)
  const level2WithoutParent = await ChartOfAccounts.findAll({
    where: {
      level: {
        [sequelize.Sequelize.Op.gt]: 1
      },
      parentAccountId: null
    }
  });
  
  for (const account of level2WithoutParent) {
    console.log(`${colors.red}✗ INVALID${colors.reset} ${account.accountCode} - ${account.accountName} (level ${account.level} requires parent)`);
    await account.destroy();
    redundantCount++;
  }
  
  if (redundantCount === 0) {
    console.log(`${colors.green}✓ No redundant accounts found${colors.reset}`);
  } else {
    console.log(`${colors.green}✓ Fixed/deleted ${redundantCount} redundant accounts${colors.reset}`);
  }
  
  return redundantCount;
}

/**
 * Optimize database indexes
 */
async function optimizeIndexes() {
  console.log(`\n${colors.cyan}=== Optimizing Database Indexes ===${colors.reset}`);
  
  try {
    // Check existing indexes
    const indexes = await sequelize.query(`
      SELECT indexname, indexdef 
      FROM pg_indexes 
      WHERE tablename = 'chart_of_accounts'
    `, { type: sequelize.QueryTypes.SELECT });
    
    console.log(`${colors.blue}Current indexes:${colors.reset}`);
    for (const idx of indexes) {
      console.log(`  - ${idx.indexname}`);
    }
    
    // Create missing indexes if needed
    const indexesToCreate = [
      {
        name: 'idx_coa_account_code',
        query: 'CREATE INDEX IF NOT EXISTS idx_coa_account_code ON chart_of_accounts(account_code)'
      },
      {
        name: 'idx_coa_account_type',
        query: 'CREATE INDEX IF NOT EXISTS idx_coa_account_type ON chart_of_accounts(account_type)'
      },
      {
        name: 'idx_coa_parent_account_id',
        query: 'CREATE INDEX IF NOT EXISTS idx_coa_parent_account_id ON chart_of_accounts(parent_account_id)'
      },
      {
        name: 'idx_coa_level',
        query: 'CREATE INDEX IF NOT EXISTS idx_coa_level ON chart_of_accounts(level)'
      },
      {
        name: 'idx_coa_is_active',
        query: 'CREATE INDEX IF NOT EXISTS idx_coa_is_active ON chart_of_accounts(is_active)'
      }
    ];
    
    let created = 0;
    for (const idx of indexesToCreate) {
      const exists = indexes.find(i => i.indexname === idx.name);
      if (!exists) {
        await sequelize.query(idx.query);
        console.log(`${colors.green}✓ Created index: ${idx.name}${colors.reset}`);
        created++;
      }
    }
    
    if (created === 0) {
      console.log(`${colors.green}✓ All indexes already exist${colors.reset}`);
    } else {
      console.log(`${colors.green}✓ Created ${created} new indexes${colors.reset}`);
    }
    
    // Analyze table for query optimization
    await sequelize.query('ANALYZE chart_of_accounts');
    console.log(`${colors.green}✓ Table analyzed for query optimization${colors.reset}`);
    
    return created;
  } catch (error) {
    console.error(`${colors.red}✗ Error optimizing indexes:${colors.reset}`, error.message);
    return 0;
  }
}

/**
 * Validate data integrity
 */
async function validateDataIntegrity() {
  console.log(`\n${colors.cyan}=== Validating Data Integrity ===${colors.reset}`);
  
  const issues = [];
  
  // 1. Check for null required fields
  const nullFields = await ChartOfAccounts.findAll({
    where: {
      [sequelize.Sequelize.Op.or]: [
        { accountCode: null },
        { accountName: null },
        { accountType: null },
        { normalBalance: null }
      ]
    }
  });
  
  if (nullFields.length > 0) {
    issues.push(`${nullFields.length} accounts with null required fields`);
    for (const account of nullFields) {
      console.log(`${colors.red}✗ NULL FIELDS${colors.reset} ${account.id} - ${account.accountCode || 'NO CODE'}`);
      await account.destroy();
    }
  }
  
  // 2. Check for invalid account types
  const validTypes = ['ASSET', 'LIABILITY', 'EQUITY', 'REVENUE', 'EXPENSE'];
  const invalidTypes = await ChartOfAccounts.findAll({
    where: {
      accountType: {
        [sequelize.Sequelize.Op.notIn]: validTypes
      }
    }
  });
  
  if (invalidTypes.length > 0) {
    issues.push(`${invalidTypes.length} accounts with invalid type`);
    for (const account of invalidTypes) {
      console.log(`${colors.red}✗ INVALID TYPE${colors.reset} ${account.accountCode} - ${account.accountType}`);
      await account.destroy();
    }
  }
  
  // 3. Check for invalid normal balance
  const invalidBalance = await ChartOfAccounts.findAll({
    where: {
      normalBalance: {
        [sequelize.Sequelize.Op.notIn]: ['DEBIT', 'CREDIT']
      }
    }
  });
  
  if (invalidBalance.length > 0) {
    issues.push(`${invalidBalance.length} accounts with invalid normal balance`);
    for (const account of invalidBalance) {
      console.log(`${colors.red}✗ INVALID BALANCE${colors.reset} ${account.accountCode} - ${account.normalBalance}`);
      await account.destroy();
    }
  }
  
  if (issues.length === 0) {
    console.log(`${colors.green}✓ Data integrity validated - no issues found${colors.reset}`);
  } else {
    console.log(`${colors.yellow}⚠ Found and fixed ${issues.length} data integrity issues${colors.reset}`);
  }
  
  return issues.length;
}

/**
 * Main cleanup function
 */
async function cleanupDatabase() {
  console.log(`\n${colors.blue}========================================`);
  console.log('  DATABASE CLEANUP');
  console.log(`========================================${colors.reset}\n`);
  
  const stats = {
    orphaned: 0,
    duplicates: 0,
    redundant: 0,
    integrity: 0,
    indexes: 0
  };
  
  try {
    stats.orphaned = await cleanOrphanedAccounts();
    stats.duplicates = await cleanDuplicateAccounts();
    stats.redundant = await cleanRedundantAccounts();
    stats.integrity = await validateDataIntegrity();
    stats.indexes = await optimizeIndexes();
    
    console.log(`\n${colors.blue}========================================`);
    console.log('  CLEANUP SUMMARY');
    console.log(`========================================${colors.reset}`);
    console.log(`${colors.green}✓ Orphaned accounts:${colors.reset}  ${stats.orphaned} removed`);
    console.log(`${colors.green}✓ Duplicate accounts:${colors.reset} ${stats.duplicates} removed`);
    console.log(`${colors.green}✓ Redundant accounts:${colors.reset} ${stats.redundant} fixed`);
    console.log(`${colors.green}✓ Integrity issues:${colors.reset}   ${stats.integrity} fixed`);
    console.log(`${colors.green}✓ Indexes optimized:${colors.reset}  ${stats.indexes} created`);
    console.log(`${colors.blue}Total cleaned:${colors.reset}       ${stats.orphaned + stats.duplicates + stats.redundant + stats.integrity} items\n`);
    
    // Show final account count
    const finalCount = await ChartOfAccounts.count({ where: { isActive: true } });
    console.log(`${colors.cyan}📊 Active accounts in database: ${finalCount}${colors.reset}\n`);
    
  } catch (error) {
    console.error(`${colors.red}✗ Cleanup failed:${colors.reset}`, error);
    throw error;
  }
}

// Run if executed directly
if (require.main === module) {
  cleanupDatabase()
    .then(() => {
      console.log(`${colors.green}✓ Database cleanup completed successfully${colors.reset}\n`);
      process.exit(0);
    })
    .catch(error => {
      console.error(`${colors.red}✗ Database cleanup failed:${colors.reset}`, error);
      process.exit(1);
    });
}

module.exports = { 
  cleanupDatabase,
  cleanOrphanedAccounts,
  cleanDuplicateAccounts,
  cleanRedundantAccounts,
  optimizeIndexes,
  validateDataIntegrity
};
