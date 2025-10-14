/**
 * useTransactions Hook
 * Custom hook for managing finance transactions CRUD operations
 */

import { useState, useCallback, useEffect } from "react";
import { financeAPI } from "../../../services/api";
import { calculateTransactionSummary } from "../utils/calculations";
import { validateTransactionForm } from "../utils/validators";
import api from "../../../services/api";

export const useTransactions = (
  selectedSubsidiary = "all",
  selectedProject = "all"
) => {
  // Transaction list state
  const [transactions, setTransactions] = useState([]);
  const [transactionLoading, setTransactionLoading] = useState(false);
  const [transactionSummary, setTransactionSummary] = useState({
    income: 0,
    expense: 0,
    balance: 0,
  });

  // Cash accounts state
  const [cashAccounts, setCashAccounts] = useState([]);
  const [loadingCashAccounts, setLoadingCashAccounts] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Form state
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [transactionForm, setTransactionForm] = useState({
    type: "expense",
    category: "",
    amount: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
    projectId: "",
    accountFrom: "",
    accountTo: "",
    referenceNumber: "",
    notes: "",
  });
  const [isSubmittingTransaction, setIsSubmittingTransaction] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  // Modal state
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  /**
   * Fetch cash/bank accounts from COA
   */
  const fetchCashAccounts = useCallback(async () => {
    try {
      setLoadingCashAccounts(true);
      const response = await api.get('/coa/cash/accounts');
      if (response.success) {
        setCashAccounts(response.data);
      }
    } catch (error) {
      console.error('Error fetching cash accounts:', error);
    } finally {
      setLoadingCashAccounts(false);
    }
  }, []);

  // Fetch cash accounts on mount
  useEffect(() => {
    fetchCashAccounts();
  }, [fetchCashAccounts]);

  /**
   * Fetch transactions with filters and pagination
   */
  const fetchTransactions = useCallback(
    async (page = 1) => {
      setTransactionLoading(true);
      try {
        const params = {
          page: page,
          limit: 10,
          sort: "date",
          order: "desc",
        };

        // Add subsidiary filter if selected
        if (selectedSubsidiary !== "all") {
          params.subsidiaryId = selectedSubsidiary;
        }

        // Add project filter if selected
        if (selectedProject !== "all") {
          params.projectId = selectedProject;
        }

        const response = await financeAPI.getTransactions(page, 10, params);

        if (response.success) {
          setTransactions(response.data || []);
          setTransactionSummary(
            response.summary || { income: 0, expense: 0, balance: 0 }
          );
          setCurrentPage(response.pagination?.current || 1);
          setTotalPages(response.pagination?.total || 1);
        }
      } catch (error) {
        console.error("Error fetching transactions:", error);
        setTransactions([]);
      } finally {
        setTransactionLoading(false);
      }
    },
    [selectedSubsidiary, selectedProject]
  );

  /**
   * Handle form field change
   */
  const handleTransactionFormChange = (field, value) => {
    setTransactionForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error for this field
    if (formErrors[field]) {
      setFormErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  /**
   * Reset transaction form
   */
  const resetTransactionForm = () => {
    setTransactionForm({
      type: "expense",
      category: "",
      amount: "",
      description: "",
      date: new Date().toISOString().split("T")[0],
      projectId: "",
      accountFrom: "",
      accountTo: "",
      referenceNumber: "",
      notes: "",
    });
    setFormErrors({});
  };

  /**
   * Validate and submit transaction
   */
  const handleSubmitTransaction = async (e) => {
    e.preventDefault();

    // Validate form
    const validation = validateTransactionForm(transactionForm);
    if (!validation.isValid) {
      setFormErrors(validation.errors);
      return;
    }

    // Additional transfer validation
    if (transactionForm.type === 'transfer') {
      if (transactionForm.accountFrom === transactionForm.accountTo) {
        setFormErrors({
          accountTo: 'Source and destination accounts must be different'
        });
        return;
      }
    }

    try {
      setIsSubmittingTransaction(true);

      // Prepare data
      const submitData = {
        type: transactionForm.type,
        category: transactionForm.category,
        amount: parseFloat(transactionForm.amount),
        description: transactionForm.description,
        date: transactionForm.date,
        accountFrom: transactionForm.accountFrom,
        accountTo: transactionForm.accountTo,
        referenceNumber: transactionForm.referenceNumber,
        notes: transactionForm.notes,
      };

      // Add projectId if provided
      if (transactionForm.projectId) {
        submitData.projectId = transactionForm.projectId;
      }

      // Remove empty fields
      Object.keys(submitData).forEach(key => {
        if (submitData[key] === '' || submitData[key] === null || submitData[key] === undefined) {
          delete submitData[key];
        }
      });

      console.log('🚀 Submitting transaction data:', submitData);

      const response = await financeAPI.create(submitData);

      console.log('📥 Response from API:', response);

      if (response.success) {
        console.log('✅ Transaction created successfully!');
        resetTransactionForm();
        setShowTransactionForm(false);
        fetchTransactions(currentPage);
        
        // Show success notification
        alert('Transaction created successfully!');
        
        return { success: true, message: "Transaction created successfully!" };
      } else {
        console.error('❌ API returned success=false:', response);
        throw new Error(response.error || "Failed to create transaction");
      }
    } catch (error) {
      console.error("❌ Error creating transaction:", error);
      console.error("Error details:", {
        message: error.message,
        stack: error.stack,
        response: error.response
      });
      
      // Show error notification
      alert('Error creating transaction: ' + error.message);
      
      return {
        success: false,
        message: "Error creating transaction: " + error.message,
      };
    } finally {
      setIsSubmittingTransaction(false);
    }
  };

  /**
   * Handle view transaction
   */
  const handleViewTransaction = (transaction) => {
    setSelectedTransaction(transaction);
    setShowViewModal(true);
  };

  /**
   * Handle edit transaction
   */
  const handleEditTransaction = (transaction) => {
    console.log('✏️ Editing transaction:', transaction);
    setSelectedTransaction(transaction);
    setTransactionForm({
      type: transaction.type,
      category: transaction.category,
      amount: transaction.amount.toString(),
      description: transaction.description,
      date: transaction.date ? transaction.date.split("T")[0] : "",
      projectId: transaction.projectId || "",
      accountFrom: transaction.accountFrom || "",
      accountTo: transaction.accountTo || "",
      referenceNumber: transaction.referenceNumber || "",
      notes: transaction.notes || "",
    });
    setShowEditModal(true);
  };

  /**
   * Handle update transaction
   */
  const handleUpdateTransaction = async (e) => {
    e.preventDefault();

    if (!selectedTransaction) return;

    console.log('🔄 Updating transaction:', selectedTransaction.id);
    console.log('📝 Update data:', transactionForm);

    // Validate form
    const validation = validateTransactionForm(transactionForm);
    if (!validation.isValid) {
      console.error('❌ Validation failed:', validation.errors);
      setFormErrors(validation.errors);
      alert('Validation Error: ' + JSON.stringify(validation.errors, null, 2));
      return;
    }

    try {
      setIsSubmittingTransaction(true);

      const submitData = {
        type: transactionForm.type,
        category: transactionForm.category,
        amount: parseFloat(transactionForm.amount),
        description: transactionForm.description,
        date: transactionForm.date,
        accountFrom: transactionForm.accountFrom,
        accountTo: transactionForm.accountTo,
        referenceNumber: transactionForm.referenceNumber,
        notes: transactionForm.notes,
      };

      // Add projectId if provided
      if (transactionForm.projectId) {
        submitData.projectId = transactionForm.projectId;
      }

      // Remove empty fields
      Object.keys(submitData).forEach(key => {
        if (submitData[key] === '' || submitData[key] === null || submitData[key] === undefined) {
          delete submitData[key];
        }
      });

      console.log('📤 Sending update:', submitData);

      const response = await financeAPI.update(
        selectedTransaction.id,
        submitData
      );

      console.log('📥 Update response:', response);

      if (response.success) {
        console.log('✅ Transaction updated successfully');
        resetTransactionForm();
        setShowEditModal(false);
        setSelectedTransaction(null);
        fetchTransactions(currentPage);
        alert('Transaction updated successfully!');
        return { success: true, message: "Transaction updated successfully!" };
      } else {
        throw new Error(response.error || "Failed to update transaction");
      }
    } catch (error) {
      console.error("❌ Error updating transaction:", error);
      alert('Error updating transaction: ' + error.message);
      return {
        success: false,
        message: "Error updating transaction: " + error.message,
      };
    } finally {
      setIsSubmittingTransaction(false);
    }
  };

  /**
   * Handle delete transaction
   */
  const handleDeleteTransaction = (transaction) => {
    setSelectedTransaction(transaction);
    setShowDeleteModal(true);
  };

  /**
   * Confirm delete transaction
   */
  const confirmDeleteTransaction = async () => {
    if (!selectedTransaction) return;

    console.log('🗑️ Deleting transaction:', selectedTransaction.id);

    try {
      const response = await financeAPI.delete(selectedTransaction.id);

      console.log('📥 Delete response:', response);

      if (response.success) {
        console.log('✅ Transaction deleted successfully');
        setShowDeleteModal(false);
        setSelectedTransaction(null);
        fetchTransactions(currentPage);
        alert('Transaction deleted successfully!');
        return { success: true, message: "Transaction deleted successfully!" };
      } else {
        throw new Error(response.error || "Failed to delete transaction");
      }
    } catch (error) {
      console.error("❌ Error deleting transaction:", error);
      alert('Error deleting transaction: ' + error.message);
      return {
        success: false,
        message: "Error deleting transaction: " + error.message,
      };
    }
  };

  /**
   * Cancel delete transaction
   */
  const cancelDeleteTransaction = () => {
    setShowDeleteModal(false);
    setSelectedTransaction(null);
  };

  /**
   * Close modals
   */
  const closeViewModal = () => {
    setShowViewModal(false);
    setSelectedTransaction(null);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setSelectedTransaction(null);
    resetTransactionForm();
  };

  /**
   * Handle page change
   */
  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchTransactions(page);
  };

  return {
    // Transaction list
    transactions,
    transactionLoading,
    transactionSummary,

    // Cash accounts
    cashAccounts,
    loadingCashAccounts,

    // Pagination
    currentPage,
    totalPages,
    setCurrentPage,

    // Form state
    showTransactionForm,
    setShowTransactionForm,
    transactionForm,
    isSubmittingTransaction,
    formErrors,

    // Modal state
    showViewModal,
    showEditModal,
    showDeleteModal,
    selectedTransaction,
    setShowViewModal,
    setShowEditModal,
    setShowDeleteModal,
    setSelectedTransaction,

    // Actions
    fetchTransactions,
    handleTransactionFormChange,
    resetTransactionForm,
    handleSubmitTransaction,
    handleViewTransaction,
    handleEditTransaction,
    handleUpdateTransaction,
    handleDeleteTransaction,
    confirmDeleteTransaction,
    cancelDeleteTransaction,
    closeViewModal,
    closeEditModal,
    handlePageChange,
  };
};
