import React, { useState, useEffect } from 'react';
import { BookOpen, Plus } from 'lucide-react';
import AccountTreeItem from './AccountTreeItem';
import { hasSubAccounts } from '../utils/accountHelpers';
import { CHART_OF_ACCOUNTS_CONFIG } from '../config/chartOfAccountsConfig';
import { fetchSubsidiaries } from '../services/subsidiaryService';

const { colors } = CHART_OF_ACCOUNTS_CONFIG;

const AccountTree = ({ 
  accounts, 
  expandedNodes, 
  onToggleNode,
  loading,
  onAddAccount,
  onViewDetail,
  onEdit,
  onDelete,
  expandedAccountId,     // NEW: Which account detail is expanded
  editingAccountId,      // NEW: Which account is being edited
  selectedAccount,       // NEW: Current account data
  deleteConfirmId,       // NEW: Show delete confirmation for this ID
  onDeleteConfirm,       // NEW: Confirm delete handler
  onDeleteCancel,        // NEW: Cancel delete handler
  isDeleting,            // NEW: Delete in progress
  editForm,              // NEW: Edit form state
  onEditSubmit,          // NEW: Edit submit handler
  onEditCancel,          // NEW: Cancel edit handler
  allAccounts,           // NEW: All accounts for parent select
  subsidiaries           // NEW: Subsidiaries for select
}) => {
  const [subsidiaryData, setSubsidiaryData] = useState({});

  useEffect(() => {
    loadSubsidiaries();
  }, []);

  const loadSubsidiaries = async () => {
    const result = await fetchSubsidiaries(true);
    if (result.success) {
      // Create a map of subsidiaryId -> subsidiary data for quick lookup
      const dataMap = {};
      result.data.forEach(sub => {
        dataMap[sub.id] = sub;
      });
      setSubsidiaryData(dataMap);
    }
  };

  const renderAccount = (account, level = 0) => {
    const isExpanded = expandedNodes.has(account.id);
    const isDetailExpanded = expandedAccountId === account.id;
    const isEditing = editingAccountId === account.id;
    const showDeleteConfirm = deleteConfirmId === account.id;
    
    return (
      <AccountTreeItem
        key={account.id}
        account={account}
        level={level}
        isExpanded={isExpanded}
        onToggleExpansion={onToggleNode}
        subsidiaryData={subsidiaryData}
        onViewDetail={onViewDetail}
        onEdit={onEdit}
        onDelete={onDelete}
        isDetailExpanded={isDetailExpanded}
        isEditing={isEditing}
        showDeleteConfirm={showDeleteConfirm}
        selectedAccount={selectedAccount}
        onDeleteConfirm={onDeleteConfirm}
        onDeleteCancel={onDeleteCancel}
        isDeleting={isDeleting}
        editForm={editForm}
        onEditSubmit={onEditSubmit}
        onEditCancel={onEditCancel}
        allAccounts={allAccounts}
        subsidiaries={subsidiaries}
      >
        {hasSubAccounts(account) && isExpanded && (
          <div>
            {account.SubAccounts.map(subAccount => 
              renderAccount(subAccount, level + 1)
            )}
          </div>
        )}
      </AccountTreeItem>
    );
  };

  // Loading state
  if (loading) {
    return (
      <div 
        className="rounded-lg" 
        style={{ 
          backgroundColor: colors.background, 
          border: `1px solid ${colors.border}` 
        }}
      >
        <div 
          className="px-6 py-4" 
          style={{ borderBottom: `1px solid ${colors.border}` }}
        >
          <h2 className="text-lg font-semibold" style={{ color: colors.text }}>
            Struktur Akun
          </h2>
        </div>
        <div className="px-6 py-12 text-center">
          <div 
            className="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto mb-4" 
            style={{ borderBottomColor: colors.primary }}
          ></div>
          <p style={{ color: colors.textSecondary }}>Loading accounts...</p>
        </div>
      </div>
    );
  }

  // Empty state
  if (!accounts || accounts.length === 0) {
    return (
      <div 
        className="rounded-lg" 
        style={{ 
          backgroundColor: colors.background, 
          border: `1px solid ${colors.border}` 
        }}
      >
        <div 
          className="px-6 py-4" 
          style={{ borderBottom: `1px solid ${colors.border}` }}
        >
          <h2 className="text-lg font-semibold" style={{ color: colors.text }}>
            Struktur Akun
          </h2>
        </div>
        <div className="px-6 py-12 text-center">
          <BookOpen 
            size={48} 
            style={{ color: colors.textSecondary, opacity: 0.3 }} 
            className="mx-auto mb-4" 
          />
          <p className="text-lg font-medium mb-2" style={{ color: colors.text }}>
            No Accounts Found
          </p>
          <p className="mb-4 text-sm" style={{ color: colors.textSecondary }}>
            Start by creating your first account to build your chart of accounts
          </p>
          {onAddAccount && (
            <button
              onClick={onAddAccount}
              className="px-4 py-2 rounded-lg transition-colors inline-flex items-center"
              style={{ backgroundColor: colors.primary, color: '#FFFFFF' }}
            >
              <Plus size={16} className="mr-2" />
              Add First Account
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div 
      className="rounded-lg" 
      style={{ 
        backgroundColor: colors.background, 
        border: `1px solid ${colors.border}` 
      }}
    >
      <div 
        className="px-6 py-4" 
        style={{ borderBottom: `1px solid ${colors.border}` }}
      >
        <h2 className="text-lg font-semibold" style={{ color: colors.text }}>
          Struktur Akun
        </h2>
      </div>
      <div style={{ borderTop: `1px solid ${colors.border}` }}>
        {accounts.map(account => renderAccount(account))}
      </div>
    </div>
  );
};

export default AccountTree;