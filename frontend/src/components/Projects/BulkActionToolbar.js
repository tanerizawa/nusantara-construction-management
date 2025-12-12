import React from 'react';
import { Archive, Trash2, X, FileText, FileSpreadsheet, Loader2 } from 'lucide-react';
import Button from '../ui/Button';
import { useTranslation } from '../../i18n';

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
  const { common } = useTranslation();
  
  if (selectedCount === 0) return null;

  return (
    <section className="rounded-3xl border border-[#0ea5e9]/25 bg-[#0ea5e9]/10 p-5 shadow-[0_20px_45px_rgba(14,165,233,0.25)] backdrop-blur">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3 text-white">
          <span className="text-sm font-semibold tracking-wide">
            {isLoading ? (
              <>
                <Loader2 className="inline h-4 w-4 animate-spin" />
                <span className="ml-2">Memproses {selectedCount} proyek...</span>
              </>
            ) : (
              `${selectedCount} proyek dipilih`
            )}
          </span>
          {!isLoading && (
            <button
              onClick={onClearSelection}
              disabled={disabled}
              className="text-white/70 transition hover:text-white disabled:opacity-50"
              aria-label="Batalkan pilihan"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            onClick={onBulkArchive}
            disabled={disabled}
            size="sm"
            variant="secondary"
            className="rounded-2xl border border-white/20 bg-white/10 px-4 py-2 text-white/80 hover:bg-white/20"
          >
            <Archive className="h-4 w-4" />
            <span>{common.archive}</span>
          </Button>
          <Button
            onClick={onBulkExportExcel}
            disabled={disabled}
            size="sm"
            variant="secondary"
            className="rounded-2xl border border-[#34d399]/30 bg-[#34d399]/15 px-4 py-2 text-[#d1fae5] hover:bg-[#34d399]/25"
          >
            <FileSpreadsheet className="h-4 w-4" />
            <span>{common.download} Excel</span>
          </Button>
          <Button
            onClick={onBulkExportPDF}
            disabled={disabled}
            size="sm"
            variant="secondary"
            className="rounded-2xl border border-[#c084fc]/30 bg-[#c084fc]/15 px-4 py-2 text-[#f3e8ff] hover:bg-[#c084fc]/25"
          >
            <FileText className="h-4 w-4" />
            <span>{common.download} PDF</span>
          </Button>
          <Button
            onClick={onBulkDelete}
            disabled={disabled}
            size="sm"
            variant="destructive"
            className="rounded-2xl border border-[#fb7185]/40 bg-[#fb7185]/15 px-4 py-2 text-[#fecdd3] hover:bg-[#fb7185]/25"
          >
            <Trash2 className="h-4 w-4" />
            <span>{common.delete}</span>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default BulkActionToolbar;
