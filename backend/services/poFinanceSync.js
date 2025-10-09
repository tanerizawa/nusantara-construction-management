const FinanceTransaction = require('../models/FinanceTransaction');
const PurchaseOrder = require('../models/PurchaseOrder');
const { v4: uuidv4 } = require('uuid');

/**
 * Purchase Order - Finance Transaction Synchronization Service
 * Handles automatic creation and updates of finance transactions based on PO status changes
 */

class POFinanceSyncService {
  /**
   * Create or update finance transaction when PO status changes
   * @param {Object} purchaseOrder - PO data
   * @param {string} previousStatus - Previous PO status
   * @returns {Object} - Created/updated finance transaction
   */
  static async syncPOToFinance(purchaseOrder, previousStatus = null) {
    try {
      const { id, status, totalAmount, poNumber, projectId, supplierId, supplierName } = purchaseOrder;

      // Check if finance transaction already exists for this PO
      let financeTransaction = await FinanceTransaction.findOne({
        where: { purchaseOrderId: id }
      });

      // Handle different status transitions
      switch (status) {
        case 'approved':
          if (!financeTransaction) {
            // Create new finance transaction when PO is approved
            financeTransaction = await this.createFinanceTransaction({
              purchaseOrderId: id,
              type: 'expense',
              category: 'Material Purchase',
              subcategory: 'Purchase Order',
              amount: totalAmount,
              description: `Purchase Order: ${poNumber} - ${supplierName}`,
              date: new Date(),
              projectId: projectId,
              referenceNumber: poNumber,
              status: 'pending', // Initially pending until received
              paymentMethod: 'bank_transfer',
              notes: `Auto-generated from Purchase Order ${poNumber}`,
              tags: ['purchase_order', 'material', supplierName.toLowerCase().replace(/\s+/g, '_')]
            });
          }
          break;

        case 'received':
          if (financeTransaction && financeTransaction.status === 'pending') {
            // Update status to completed when goods are received
            await financeTransaction.update({
              status: 'completed',
              notes: financeTransaction.notes + ` | Goods received on ${new Date().toISOString().split('T')[0]}`
            });
          }
          break;

        case 'cancelled':
          if (financeTransaction && financeTransaction.status !== 'cancelled') {
            // Cancel the finance transaction
            await financeTransaction.update({
              status: 'cancelled',
              notes: financeTransaction.notes + ` | PO cancelled on ${new Date().toISOString().split('T')[0]}`
            });
          }
          break;

        default:
          // No action needed for draft or pending status
          break;
      }

      return financeTransaction;
    } catch (error) {
      console.error('❌ Error syncing PO to finance:', error);
      throw error;
    }
  }

  /**
   * Create a new finance transaction
   * @param {Object} transactionData - Transaction data
   * @returns {Object} - Created finance transaction
   */
  static async createFinanceTransaction(transactionData) {
    const transactionId = `FIN-PO-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    
    return await FinanceTransaction.create({
      id: transactionId,
      ...transactionData
    });
  }

  /**
   * Get finance transactions for a specific PO
   * @param {string} purchaseOrderId - PO ID
   * @returns {Array} - Finance transactions
   */
  static async getFinanceTransactionsByPO(purchaseOrderId) {
    return await FinanceTransaction.findAll({
      where: { purchaseOrderId },
      order: [['createdAt', 'DESC']]
    });
  }

  /**
   * Sync multiple POs (for bulk operations or initial sync)
   * @param {Array} purchaseOrderIds - Array of PO IDs to sync
   * @returns {Array} - Results of sync operations
   */
  static async syncMultiplePOs(purchaseOrderIds) {
    const results = [];
    
    for (const poId of purchaseOrderIds) {
      try {
        const po = await PurchaseOrder.findByPk(poId);
        if (po) {
          const result = await this.syncPOToFinance(po);
          results.push({ poId, success: true, transaction: result });
        }
      } catch (error) {
        results.push({ poId, success: false, error: error.message });
      }
    }
    
    return results;
  }

  /**
   * Get financial summary for POs in a project
   * @param {string} projectId - Project ID
   * @returns {Object} - Financial summary
   */
  static async getPOFinancialSummary(projectId) {
    const transactions = await FinanceTransaction.findAll({
      where: { 
        projectId,
        purchaseOrderId: { [require('sequelize').Op.ne]: null }
      },
      include: [{
        model: PurchaseOrder,
        as: 'purchaseOrder'
      }]
    });

    const summary = {
      totalCommitted: 0,
      totalPending: 0,
      totalCompleted: 0,
      totalCancelled: 0,
      transactions: transactions.length
    };

    transactions.forEach(transaction => {
      const amount = parseFloat(transaction.amount);
      summary.totalCommitted += amount;
      
      switch (transaction.status) {
        case 'pending':
          summary.totalPending += amount;
          break;
        case 'completed':
          summary.totalCompleted += amount;
          break;
        case 'cancelled':
          summary.totalCancelled += amount;
          break;
      }
    });

    return summary;
  }
}

module.exports = POFinanceSyncService;