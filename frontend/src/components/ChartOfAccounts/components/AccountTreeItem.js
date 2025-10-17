import React from 'react';
import { ChevronDown, ChevronRight, Eye, Edit2, Trash2, Building2 } from 'lucide-react';
import { getAccountTypeIcon, getAccountTypeColor } from '../config/accountTypes';
import { formatCurrency } from '../utils/accountCalculations';
import { hasSubAccounts } from '../utils/accountHelpers';
import { CHART_OF_ACCOUNTS_CONFIG } from '../config/chartOfAccountsConfig';
import InlineAccountDetail from './InlineAccountDetail';
import InlineEditForm from './InlineEditForm';
import InlineDeleteConfirm from './InlineDeleteConfirm';

const { colors, ui } = CHART_OF_ACCOUNTS_CONFIG;

const AccountTreeItem = ({ 
  account, 
  level = 0, 
  isExpanded, 
  onToggleExpansion, 
  children,
  subsidiaryData,
  onViewDetail,
  onEdit,
  onDelete,
  isDetailExpanded,    // NEW: Is detail view expanded for this account
  isEditing,           // NEW: Is edit form shown for this account
  showDeleteConfirm,   // NEW: Show delete confirmation for this account
  selectedAccount,     // NEW: Current account data (for detail/edit/delete)
  onDeleteConfirm,     // NEW: Confirm delete handler
  onDeleteCancel,      // NEW: Cancel delete handler
  isDeleting,          // NEW: Delete in progress
  editForm,            // NEW: Edit form state
  onEditSubmit,        // NEW: Edit submit handler
  onEditCancel,        // NEW: Cancel edit handler
  allAccounts,         // NEW: All accounts for parent select
  subsidiaries         // NEW: Subsidiaries for select
}) => {
  const hasChildren = hasSubAccounts(account);
  const paddingLeft = level * ui.treeViewPadding;

  const handleClick = () => {
    if (hasChildren && onToggleExpansion) {
      onToggleExpansion(account.id);
    }
  };

  return (
    <div key={account.id} style={{ borderBottom: `1px solid ${colors.border}` }}>
      <div 
        className="flex items-center py-3 hover:bg-white/5 transition-colors duration-150 group"
        style={{ paddingLeft: `${paddingLeft + 12}px` }}
      >
        <div className="flex items-center flex-1">
          {/* Expand/Collapse Button */}
          {hasChildren && (
            <button 
              className="mr-2 p-1 hover:bg-white/10 rounded transition-colors"
              onClick={handleClick}
            >
              {isExpanded ? 
                <ChevronDown size={16} style={{ color: colors.textSecondary }} /> : 
                <ChevronRight size={16} style={{ color: colors.textSecondary }} />
              }
            </button>
          )}
          {!hasChildren && <div className="w-6" />}
          
          {/* Account Type Icon */}
          <div className="mr-3">
            {getAccountTypeIcon(account.accountType)}
          </div>
          
          {/* Account Info */}
          <div className="flex-1">
            <div className="flex items-center justify-between">
              {/* Left Side - Account Code & Name */}
              <div className="flex items-center flex-1 min-w-0">
                <span 
                  className="font-mono text-sm mr-3 flex-shrink-0" 
                  style={{ color: colors.textSecondary }}
                >
                  {account.accountCode}
                </span>
                <span 
                  className="font-medium truncate" 
                  style={{ color: colors.text }}
                >
                  {account.accountName}
                </span>
                
                {/* Construction Badge */}
                {account.constructionSpecific && (
                  <span 
                    className="ml-2 text-xs px-2 py-1 rounded flex-shrink-0" 
                    style={{ 
                      backgroundColor: "rgba(10, 132, 255, 0.15)", 
                      color: colors.primary 
                    }}
                  >
                    Konstruksi
                  </span>
                )}
                
                {/* Cost Center Badge */}
                {account.projectCostCenter && (
                  <span 
                    className="ml-2 text-xs px-2 py-1 rounded flex-shrink-0" 
                    style={{ 
                      backgroundColor: "rgba(50, 215, 75, 0.15)", 
                      color: colors.success 
                    }}
                  >
                    Cost Center
                  </span>
                )}
                
                {/* Subsidiary Badge */}
                {account.subsidiaryId && subsidiaryData?.[account.subsidiaryId] && (
                  <span 
                    className="ml-2 text-xs px-2 py-1 rounded flex items-center gap-1 flex-shrink-0" 
                    style={{ 
                      backgroundColor: "rgba(255, 159, 10, 0.15)", 
                      color: "#FF9F0A"
                    }}
                    title={subsidiaryData[account.subsidiaryId].name}
                  >
                    <Building2 size={12} />
                    {subsidiaryData[account.subsidiaryId].code}
                  </span>
                )}
              </div>
              
              {/* Right Side - Actions & Balance */}
              <div className="flex items-center gap-4 ml-4 flex-shrink-0">
                {/* Action Buttons - Show on hover */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {onViewDetail && (
                    <button
                      onClick={(e) => {
                        console.log('👁️ View button clicked in AccountTreeItem');
                        e.stopPropagation();
                        onViewDetail(account);
                      }}
                      className="p-1.5 rounded hover:bg-blue-500/20 transition-colors"
                      title="View Details"
                    >
                      <Eye size={16} style={{ color: '#3B82F6' }} />
                    </button>
                  )}
                  
                  {onEdit && (
                    <button
                      onClick={(e) => {
                        console.log('✏️ Edit button clicked in AccountTreeItem');
                        e.stopPropagation();
                        onEdit(account);
                      }}
                      className="p-1.5 rounded hover:bg-yellow-500/20 transition-colors"
                      title="Edit Account"
                    >
                      <Edit2 size={16} style={{ color: '#F59E0B' }} />
                    </button>
                  )}
                  
                  {onDelete && (
                    <button
                      onClick={(e) => {
                        console.log('🗑️ Delete button clicked in AccountTreeItem');
                        e.stopPropagation();
                        onDelete(account);
                      }}
                      className="p-1.5 rounded hover:bg-red-500/20 transition-colors"
                      title="Delete Account"
                    >
                      <Trash2 size={16} style={{ color: '#EF4444' }} />
                    </button>
                  )}
                </div>
                
                {/* Balance Information */}
                {(account.debit > 0 || account.credit > 0) && (
                  <div className="text-right">
                    <div 
                      className="text-sm font-medium"
                      style={{
                        color: account.balance > 0 ? colors.success : 
                               account.balance < 0 ? colors.error : colors.text
                      }}
                    >
                      {account.balance > 0 ? '+' : account.balance < 0 ? '-' : ''}
                      {formatCurrency(Math.abs(account.balance || 0), {
                        locale: 'id-ID',
                        currency: 'IDR',
                        minimumFractionDigits: 0
                      })}
                    </div>
                    <div className="text-xs" style={{ color: colors.textTertiary }}>
                      D: {formatCurrency(account.debit || 0, { 
                        locale: 'id-ID', 
                        currency: 'IDR', 
                        minimumFractionDigits: 0 
                      })} |
                      C: {formatCurrency(account.credit || 0, { 
                        locale: 'id-ID', 
                        currency: 'IDR', 
                        minimumFractionDigits: 0 
                      })}
                    </div>
                  </div>
                )}
                
                {/* Account Type Badge */}
                <span 
                  className="text-xs px-2 py-1 rounded-full"
                  style={{
                    backgroundColor: getAccountTypeColor(account.accountType).bg,
                    color: getAccountTypeColor(account.accountType).color
                  }}
                >
                  {account.accountType}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* INLINE DETAIL VIEW */}
      {isDetailExpanded && selectedAccount && selectedAccount.id === account.id && (
        <InlineAccountDetail
          account={selectedAccount}
          onClose={() => onViewDetail(account)}
          subsidiaryData={subsidiaryData}
        />
      )}
      
      {/* INLINE EDIT FORM */}
      {isEditing && selectedAccount && selectedAccount.id === account.id && editForm && (
        <InlineEditForm
          account={selectedAccount}
          formData={editForm.formData}
          errors={editForm.errors}
          isSubmitting={editForm.isSubmitting}
          allAccounts={allAccounts}
          subsidiaries={subsidiaries}
          onFormChange={editForm.handleFormChange}
          onSubmit={onEditSubmit}
          onCancel={onEditCancel}
        />
      )}
      
      {/* INLINE DELETE CONFIRMATION */}
      {showDeleteConfirm && selectedAccount && selectedAccount.id === account.id && (
        <InlineDeleteConfirm
          account={selectedAccount}
          onConfirm={onDeleteConfirm}
          onCancel={onDeleteCancel}
          isDeleting={isDeleting}
        />
      )}
      
      {hasChildren && isExpanded && children}
    </div>
  );
};

export default AccountTreeItem;
