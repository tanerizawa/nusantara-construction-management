import React from 'react';
import { Archive, Download, Trash2, X, FileText, FileSpreadsheet, Loader2 } from 'lucide-react';
import Button from '../ui/Button';

/**
 * Bulk Action Toolbar
 * Shows when projects are selected, provides bulk operations
 */
const BulkActionToolbar = ({ 
  selectedCount, 
  onBulkArchive, 
  onBulkExportExcel,
  onBulkExportPDF,
  onBulkDelete,
  onClearSelection,
  disabled = false,
  isLoading = false // New prop untuk show loading state
}) => {
  if (selectedCount === 0) return null;

  return (
    <div className="bg-[#0A84FF]/10 border border-[#0A84FF]/30 rounded-lg p-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        {/* Selection Info */}
        <div className="flex items-center gap-3">
          <span className="text-white font-medium">
            {isLoading ? (
              <>
                <Loader2 className="inline w-4 h-4 mr-2 animate-spin" />
                Memproses {selectedCount} proyek...
              </>
            ) : (
              `${selectedCount} proyek dipilih`
            )}
          </span>
          {!isLoading && (
            <button
              onClick={onClearSelection}
              disabled={disabled}
              className="text-[#8E8E93] hover:text-white transition-colors duration-150
                         disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Batalkan pilihan"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Bulk Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Archive Selected */}
          <Button
            onClick={onBulkArchive}
            disabled={disabled}
            size="sm"
            variant="secondary"
            className="!bg-[#8E8E93]/20 !text-[#8E8E93] 
                       hover:!bg-[#8E8E93]/30 hover:!text-white
                       !border !border-[#8E8E93]/30
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition-all duration-150"
          >
            <Archive className="w-4 h-4" />
            <span>Arsipkan</span>
          </Button>

          {/* Export to Excel */}
          <Button
            onClick={onBulkExportExcel}
            disabled={disabled}
            size="sm"
            variant="secondary"
            className="!bg-[#30D158]/20 !text-[#30D158] 
                       hover:!bg-[#30D158]/30 hover:!text-white
                       !border !border-[#30D158]/30
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition-all duration-150"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Export Excel</span>
          </Button>

          {/* Export to PDF */}
          <Button
            onClick={onBulkExportPDF}
            disabled={disabled}
            size="sm"
            variant="secondary"
            className="!bg-[#BF5AF2]/20 !text-[#BF5AF2] 
                       hover:!bg-[#BF5AF2]/30 hover:!text-white
                       !border !border-[#BF5AF2]/30
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition-all duration-150"
          >
            <FileText className="w-4 h-4" />
            <span>Export PDF</span>
          </Button>

          {/* Delete Selected */}
          <Button
            onClick={onBulkDelete}
            disabled={disabled}
            size="sm"
            variant="destructive"
            className="!bg-[#FF3B30]/20 !text-[#FF3B30] 
                       hover:!bg-[#FF3B30]/30 hover:!text-white
                       !border !border-[#FF3B30]/30
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition-all duration-150"
          >
            <Trash2 className="w-4 h-4" />
            <span>Hapus</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BulkActionToolbar;
