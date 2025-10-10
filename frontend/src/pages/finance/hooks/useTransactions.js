/**
 * useTransactions Hook
 * Custom hook for managing finance transactions CRUD operations
 */

import { useState, useCallback } from "react";
import { financeAPI } from "../../../services/api";
import { calculateTransactionSummary } from "../utils/calculations";
import { validateTransactionForm } from "../utils/validators";

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
    paymentMethod: "bank_transfer",
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
      paymentMethod: "bank_transfer",
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

    try {
      setIsSubmittingTransaction(true);

      // Prepare data
      const submitData = {
        ...transactionForm,
        amount: parseFloat(transactionForm.amount),
      };

      // Remove empty projectId to avoid foreign key constraints
      if (!submitData.projectId) {
        delete submitData.projectId;
      }

      const response = await financeAPI.create(submitData);

      if (response.success) {
        resetTransactionForm();
        setShowTransactionForm(false);
        fetchTransactions(currentPage);
        return { success: true, message: "Transaction created successfully!" };
      } else {
        throw new Error(response.error || "Failed to create transaction");
      }
    } catch (error) {
      console.error("Error creating transaction:", error);
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
    setSelectedTransaction(transaction);
    setTransactionForm({
      type: transaction.type,
      category: transaction.category,
      amount: transaction.amount.toString(),
      description: transaction.description,
      date: transaction.date ? transaction.date.split("T")[0] : "",
      projectId: transaction.projectId || "",
      paymentMethod: transaction.paymentMethod || "bank_transfer",
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

    // Validate form
    const validation = validateTransactionForm(transactionForm);
    if (!validation.isValid) {
      setFormErrors(validation.errors);
      return;
    }

    try {
      setIsSubmittingTransaction(true);

      const submitData = {
        ...transactionForm,
        amount: parseFloat(transactionForm.amount),
      };

      if (!submitData.projectId) {
        delete submitData.projectId;
      }

      const response = await financeAPI.update(
        selectedTransaction.id,
        submitData
      );

      if (response.success) {
        resetTransactionForm();
        setShowEditModal(false);
        setSelectedTransaction(null);
        fetchTransactions(currentPage);
        return { success: true, message: "Transaction updated successfully!" };
      } else {
        throw new Error(response.error || "Failed to update transaction");
      }
    } catch (error) {
      console.error("Error updating transaction:", error);
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

    try {
      const response = await financeAPI.delete(selectedTransaction.id);

      if (response.success) {
        setShowDeleteModal(false);
        setSelectedTransaction(null);
        fetchTransactions(currentPage);
        return { success: true, message: "Transaction deleted successfully!" };
      } else {
        throw new Error(response.error || "Failed to delete transaction");
      }
    } catch (error) {
      console.error("Error deleting transaction:", error);
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

    // Pagination
    currentPage,
    totalPages,

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
