import { 
  FileBarChart, 
  ShoppingCart,
  PackageCheck,
  ClipboardCheck
} from 'lucide-react';

/**
 * Approval Categories Configuration
 * Defines the main approval categories in the system
 */
export const approvalCategories = [
  {
    id: 'rab',
    name: 'RAB',
    fullName: 'RAB & BOQ',
    icon: FileBarChart,
    color: 'bg-[#0A84FF]/20 text-[#0A84FF]',
    description: 'Rencana Anggaran Biaya & Bill of Quantities'
  },
  {
    id: 'purchaseOrders',
    name: 'PO',
    fullName: 'Purchase Orders',
    icon: ShoppingCart,
    color: 'bg-[#30D158]/20 text-[#30D158]',
    description: 'Pemesanan material dan equipment'
  },
  {
    id: 'tandaTerima',
    name: 'Tanda Terima',
    fullName: 'Tanda Terima',
    icon: PackageCheck,
    color: 'bg-[#BF5AF2]/20 text-[#BF5AF2]',
    description: 'Konfirmasi penerimaan barang dari PO yang sudah approved'
  },
  {
    id: 'beritaAcara',
    name: 'Berita Acara',
    fullName: 'Berita Acara',
    icon: ClipboardCheck,
    color: 'bg-[#FF9F0A]/20 text-[#FF9F0A]',
    description: 'Persetujuan Berita Acara kemajuan pekerjaan'
  }
];
