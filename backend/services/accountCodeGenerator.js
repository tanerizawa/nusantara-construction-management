/**
 * Account Code Generator Service
 * 
 * Automatically generates PSAK-compliant account codes
 * based on account type, parent, and hierarchy level.
 * 
 * PSAK Account Structure:
 * - 1xxx: ASSET
 * - 2xxx: LIABILITY
 * - 3xxx: EQUITY
 * - 4xxx: REVENUE
 * - 5xxx: EXPENSE
 * 
 * Levels:
 * - Level 1: 1xxx (Control Account)
 * - Level 2: 11xx (Control Account)
 * - Level 3: 1101 (Postable Account)
 * - Level 4: 1101.01 (Detail Account)
 */

const { models } = require('../models');
const { ChartOfAccounts } = models;
const { Op } = require('sequelize');

class AccountCodeGenerator {
  /**
   * Account type prefixes (PSAK standard)
   */
  static ACCOUNT_PREFIXES = {
    ASSET: '1',
    LIABILITY: '2',
    EQUITY: '3',
    REVENUE: '4',
    EXPENSE: '5'
  };

  /**
   * Generate next available account code
   * 
   * @param {Object} options - Generation options
   * @param {string} options.accountType - ASSET, LIABILITY, EQUITY, REVENUE, EXPENSE
   * @param {string} options.parentId - Parent account ID (optional for level 1)
   * @param {number} options.level - Account level (1-4)
   * @returns {Promise<Object>} Generated code info
   */
  static async generateNextCode({ accountType, parentId, level }) {
    console.log('[AccountCodeGenerator] Generating code:', { accountType, parentId, level });

    // Normalize parentId: convert empty string to null
    const normalizedParentId = parentId && parentId.trim() !== '' ? parentId : null;

    // Validate input
    if (!accountType || !level) {
      throw new Error('accountType and level are required');
    }

    if (level < 1 || level > 4) {
      throw new Error('Level must be between 1 and 4');
    }

    if (level > 1 && !normalizedParentId) {
      throw new Error('parentId is required for level > 1');
    }

    // Get account type prefix
    const prefix = this.ACCOUNT_PREFIXES[accountType];
    if (!prefix) {
      throw new Error(`Invalid account type: ${accountType}`);
    }

    let suggestedCode;
    let parentCode = null;

    // Level 1: Generate main account type code (1000, 2000, etc.)
    if (level === 1) {
      suggestedCode = await this._generateLevel1Code(prefix);
    }
    // Level 2-4: Generate based on parent
    else {
      const parent = await ChartOfAccounts.findByPk(normalizedParentId);
      if (!parent) {
        throw new Error('Parent account not found');
      }

      // Validate parent level
      if (parent.level !== level - 1) {
        throw new Error(`Parent level must be ${level - 1} for creating level ${level} account`);
      }

      parentCode = parent.accountCode;

      if (level === 2) {
        suggestedCode = await this._generateLevel2Code(parentCode);
      } else if (level === 3) {
        suggestedCode = await this._generateLevel3Code(parentCode);
      } else if (level === 4) {
        suggestedCode = await this._generateLevel4Code(parentCode);
      }
    }

    // Verify code is unique - with retry mechanism
    let finalCode = suggestedCode;
    let retryCount = 0;
    const maxRetries = 10;
    
    while (retryCount < maxRetries) {
      const exists = await ChartOfAccounts.findOne({
        where: { accountCode: finalCode }
      });

      if (!exists) {
        console.log('[AccountCodeGenerator] Generated code:', finalCode);
        return {
          suggestedCode: finalCode,
          accountType,
          level,
          parentCode,
          prefix,
          isUnique: true
        };
      }

      // Code exists, try next number
      console.log(`[AccountCodeGenerator] Code ${finalCode} exists, trying alternative...`);
      retryCount++;

      // Generate alternative code based on level
      if (level === 1) {
        // Level 1: increment by 1000 (1000, 2000, 3000, etc.)
        const currentNum = parseInt(finalCode);
        finalCode = String(currentNum + 1000);
      } else if (level === 2) {
        // Level 2: increment by 100 (1100, 1200, 1300, etc.)
        const currentNum = parseInt(finalCode);
        finalCode = String(currentNum + 100);
      } else if (level === 3) {
        // Level 3: increment by 1 (1101, 1102, 1103, etc.)
        const currentNum = parseInt(finalCode);
        finalCode = String(currentNum + 1);
      } else if (level === 4) {
        // Level 4: increment suffix (1101.01, 1101.02, 1101.03, etc.)
        const parts = finalCode.split('.');
        if (parts.length === 2) {
          const suffix = parseInt(parts[1]) + 1;
          finalCode = `${parts[0]}.${String(suffix).padStart(2, '0')}`;
        } else {
          // Fallback if format is different
          const currentNum = parseInt(finalCode.replace(/\D/g, ''));
          finalCode = `${parentCode}.${String(currentNum + 1).padStart(2, '0')}`;
        }
      }
    }

    // Max retries reached
    throw new Error(`Unable to generate unique code after ${maxRetries} attempts. Please create manually.`);
  }

  /**
   * Generate Level 1 code (Control account: 1000, 2000, etc.)
   */
  static async _generateLevel1Code(prefix) {
    // Level 1 codes are fixed: 1000, 2000, 3000, 4000, 5000
    const baseCode = `${prefix}000`;

    // Check if base code exists
    const exists = await ChartOfAccounts.findOne({
      where: { accountCode: baseCode }
    });

    if (exists) {
      // If base code exists, increment: 1100, 1200, etc.
      const pattern = `${prefix}%`;
      const existingCodes = await ChartOfAccounts.findAll({
        where: {
          accountCode: {
            [Op.like]: pattern
          },
          level: 1
        },
        order: [['accountCode', 'ASC']]
      });

      if (existingCodes.length === 0) {
        return baseCode;
      }

      // Get highest code and increment
      const lastCode = existingCodes[existingCodes.length - 1].accountCode;
      const lastNumber = parseInt(lastCode.substring(1));
      const nextNumber = lastNumber + 100;

      return `${prefix}${nextNumber.toString().padStart(3, '0')}`;
    }

    return baseCode;
  }

  /**
   * Generate Level 2 code (Control account: 1100, 1200, etc.)
   */
  static async _generateLevel2Code(parentCode) {
    // Parent code: "1000"
    // Child codes: "1100", "1200", "1300"

    const prefix = parentCode.substring(0, 1); // "1"
    const pattern = `${prefix}_00`;

    const existingCodes = await ChartOfAccounts.findAll({
      where: {
        accountCode: {
          [Op.like]: pattern
        },
        level: 2,
        parentAccountId: {
          [Op.ne]: null
        }
      },
      order: [['accountCode', 'ASC']]
    });

    if (existingCodes.length === 0) {
      return `${prefix}100`;
    }

    // Get highest code and increment by 100
    const lastCode = existingCodes[existingCodes.length - 1].accountCode;
    const lastNumber = parseInt(lastCode);
    const nextNumber = lastNumber + 100;

    return nextNumber.toString();
  }

  /**
   * Generate Level 3 code (Postable: 1101, 1102, etc.)
   */
  static async _generateLevel3Code(parentCode) {
    // Parent code: "1100"
    // Child codes: "1101", "1102", "1103"

    const pattern = `${parentCode.substring(0, 3)}%`;

    const existingCodes = await ChartOfAccounts.findAll({
      where: {
        accountCode: {
          [Op.like]: pattern
        },
        level: 3
      },
      order: [['accountCode', 'ASC']]
    });

    if (existingCodes.length === 0) {
      return `${parentCode.substring(0, 3)}1`;
    }

    // Get highest code and increment
    const lastCode = existingCodes[existingCodes.length - 1].accountCode;
    const lastNumber = parseInt(lastCode);
    const nextNumber = lastNumber + 1;

    return nextNumber.toString();
  }

  /**
   * Generate Level 4 code (Detail: 1101.01, 1101.02, etc.)
   */
  static async _generateLevel4Code(parentCode) {
    // Parent code: "1101"
    // Child codes: "1101.01", "1101.02", "1101.03"

    const pattern = `${parentCode}.%`;

    const existingCodes = await ChartOfAccounts.findAll({
      where: {
        accountCode: {
          [Op.like]: pattern
        },
        level: 4
      },
      order: [['accountCode', 'ASC']]
    });

    if (existingCodes.length === 0) {
      return `${parentCode}.01`;
    }

    // Get highest code and increment
    const lastCode = existingCodes[existingCodes.length - 1].accountCode;
    const lastNumber = parseInt(lastCode.split('.')[1]);
    const nextNumber = lastNumber + 1;

    return `${parentCode}.${nextNumber.toString().padStart(2, '0')}`;
  }

  /**
   * Validate account code format
   */
  static validateAccountCode(code, accountType, level) {
    const prefix = this.ACCOUNT_PREFIXES[accountType];

    if (!code.startsWith(prefix)) {
      return {
        valid: false,
        error: `Account code must start with ${prefix} for ${accountType} type`
      };
    }

    // Level-specific validation
    const patterns = {
      1: new RegExp(`^${prefix}\\d{3}$`),           // 1000
      2: new RegExp(`^${prefix}\\d{3}$`),           // 1100
      3: new RegExp(`^${prefix}\\d{3}$`),           // 1101
      4: new RegExp(`^${prefix}\\d{3}\\.\\d{2}$`)   // 1101.01
    };

    const pattern = patterns[level];
    if (!pattern.test(code)) {
      return {
        valid: false,
        error: `Invalid format for level ${level}. Expected pattern: ${pattern}`
      };
    }

    return { valid: true };
  }

  /**
   * Get available parent accounts for given type and level
   */
  static async getAvailableParents(accountType, level) {
    if (level === 1) {
      return []; // Level 1 has no parent
    }

    const parentLevel = level - 1;
    const prefix = this.ACCOUNT_PREFIXES[accountType];

    const parents = await ChartOfAccounts.findAll({
      where: {
        accountType,
        level: parentLevel,
        accountCode: {
          [Op.like]: `${prefix}%`
        },
        isActive: true
      },
      order: [['accountCode', 'ASC']]
    });

    return parents.map(p => ({
      id: p.id,
      code: p.accountCode,
      name: p.accountName,
      level: p.level,
      type: p.accountType
    }));
  }

  /**
   * Suggest account properties based on code/type
   */
  static suggestAccountProperties(code, accountType) {
    const suggestions = {
      normalBalance: ['ASSET', 'EXPENSE'].includes(accountType) ? 'DEBIT' : 'CREDIT',
      isControlAccount: code.length <= 4, // Codes without decimal are control accounts
      constructionSpecific: false,
      projectCostCenter: false,
      vatApplicable: false,
      taxDeductible: accountType === 'EXPENSE'
    };

    // Determine sub-type based on code
    if (accountType === 'ASSET') {
      if (code.startsWith('11')) {
        suggestions.accountSubType = 'CURRENT_ASSET';
      } else if (code.startsWith('12')) {
        suggestions.accountSubType = 'FIXED_ASSET';
      } else if (code.startsWith('13')) {
        suggestions.accountSubType = 'OTHER_ASSET';
      }

      // Specific sub-types
      if (code.startsWith('1101')) {
        suggestions.accountSubType = 'CASH_AND_BANK';
        suggestions.projectCostCenter = false;
      } else if (code.startsWith('1102')) {
        suggestions.accountSubType = 'ACCOUNTS_RECEIVABLE';
      } else if (code.startsWith('1103')) {
        suggestions.accountSubType = 'INVENTORY';
        suggestions.constructionSpecific = true;
      }
    } else if (accountType === 'EXPENSE') {
      if (code.startsWith('51')) {
        suggestions.accountSubType = 'DIRECT_COST';
        suggestions.constructionSpecific = true;
        suggestions.projectCostCenter = true;
      } else if (code.startsWith('52')) {
        suggestions.accountSubType = 'OPERATING_EXPENSE';
        suggestions.projectCostCenter = false;
      }
    }

    return suggestions;
  }
}

module.exports = AccountCodeGenerator;
