/**
 * Finance Calculations Utility
 * Financial calculation functions
 */

/**
 * Calculate transaction summary
 * @param {Array} transactions - Array of transaction objects
 * @returns {Object} Summary with income, expense, and balance
 */
export const calculateTransactionSummary = (transactions) => {
  if (!Array.isArray(transactions) || transactions.length === 0) {
    return {
      income: 0,
      expense: 0,
      balance: 0,
    };
  }

  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);

  const expense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);

  return {
    income,
    expense,
    balance: income - expense,
  };
};

/**
 * Calculate tax amount based on percentage
 * @param {number} amount - Base amount
 * @param {number} percentage - Tax percentage
 * @returns {number} Tax amount
 */
export const calculateTax = (amount, percentage) => {
  if (!amount || !percentage) return 0;
  return (parseFloat(amount) * parseFloat(percentage)) / 100;
};

/**
 * Calculate net amount after tax
 * @param {number} amount - Gross amount
 * @param {number} taxAmount - Tax amount
 * @returns {number} Net amount
 */
export const calculateNetAmount = (amount, taxAmount) => {
  return parseFloat(amount || 0) - parseFloat(taxAmount || 0);
};

/**
 * Calculate percentage change
 * @param {number} current - Current value
 * @param {number} previous - Previous value
 * @returns {number} Percentage change
 */
export const calculatePercentageChange = (current, previous) => {
  if (!previous || previous === 0) return 0;
  return ((current - previous) / previous) * 100;
};

/**
 * Calculate total from array of amounts
 * @param {Array} items - Array of objects with amount field
 * @param {string} field - Field name containing amount
 * @returns {number} Total amount
 */
export const calculateTotal = (items, field = "amount") => {
  if (!Array.isArray(items) || items.length === 0) return 0;
  return items.reduce((sum, item) => sum + parseFloat(item[field] || 0), 0);
};

/**
 * Group transactions by category
 * @param {Array} transactions - Array of transaction objects
 * @returns {Object} Transactions grouped by category
 */
export const groupTransactionsByCategory = (transactions) => {
  if (!Array.isArray(transactions)) return {};

  return transactions.reduce((groups, transaction) => {
    const category = transaction.category || "Uncategorized";
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(transaction);
    return groups;
  }, {});
};

/**
 * Calculate category totals
 * @param {Array} transactions - Array of transaction objects
 * @returns {Array} Array of category totals sorted by amount
 */
export const calculateCategoryTotals = (transactions) => {
  if (!Array.isArray(transactions) || transactions.length === 0) return [];

  const grouped = groupTransactionsByCategory(transactions);

  return Object.entries(grouped)
    .map(([category, items]) => ({
      category,
      count: items.length,
      total: calculateTotal(items, "amount"),
    }))
    .sort((a, b) => b.total - a.total);
};

/**
 * Calculate monthly totals
 * @param {Array} transactions - Array of transaction objects
 * @returns {Array} Array of monthly totals
 */
export const calculateMonthlyTotals = (transactions) => {
  if (!Array.isArray(transactions) || transactions.length === 0) return [];

  const grouped = transactions.reduce((groups, transaction) => {
    const date = new Date(transaction.date);
    const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}`;

    if (!groups[month]) {
      groups[month] = { income: 0, expense: 0 };
    }

    if (transaction.type === "income") {
      groups[month].income += parseFloat(transaction.amount || 0);
    } else if (transaction.type === "expense") {
      groups[month].expense += parseFloat(transaction.amount || 0);
    }

    return groups;
  }, {});

  return Object.entries(grouped)
    .map(([month, totals]) => ({
      month,
      ...totals,
      balance: totals.income - totals.expense,
    }))
    .sort((a, b) => a.month.localeCompare(b.month));
};

/**
 * Calculate running balance
 * @param {Array} transactions - Array of transaction objects (must be sorted by date)
 * @param {number} initialBalance - Initial balance
 * @returns {Array} Transactions with running balance
 */
export const calculateRunningBalance = (transactions, initialBalance = 0) => {
  if (!Array.isArray(transactions)) return [];

  let balance = initialBalance;

  return transactions.map((transaction) => {
    const amount = parseFloat(transaction.amount || 0);
    balance += transaction.type === "income" ? amount : -amount;

    return {
      ...transaction,
      runningBalance: balance,
    };
  });
};

/**
 * Calculate budget variance
 * @param {number} budget - Budgeted amount
 * @param {number} actual - Actual amount
 * @returns {Object} Variance details
 */
export const calculateBudgetVariance = (budget, actual) => {
  const variance = budget - actual;
  const variancePercentage = budget > 0 ? (variance / budget) * 100 : 0;

  return {
    variance,
    variancePercentage,
    isOverBudget: variance < 0,
    isUnderBudget: variance > 0,
    isOnBudget: Math.abs(variancePercentage) < 5, // Within 5% tolerance
  };
};

/**
 * Calculate project finance summary
 * @param {Array} transactions - Project transactions
 * @param {number} budget - Project budget
 * @returns {Object} Project finance summary
 */
export const calculateProjectFinanceSummary = (transactions, budget) => {
  const summary = calculateTransactionSummary(transactions);
  const spent = summary.expense;
  const remaining = budget - spent;
  const percentageUsed = budget > 0 ? (spent / budget) * 100 : 0;

  return {
    budget,
    spent,
    remaining,
    percentageUsed,
    income: summary.income,
    isOverBudget: spent > budget,
    transactionCount: transactions.length,
  };
};
