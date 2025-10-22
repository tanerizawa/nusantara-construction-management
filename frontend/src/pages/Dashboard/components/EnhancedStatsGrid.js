import React from 'react';
import { StatsCard } from '../../../components/common/DashboardComponents';
import { 
  Building, 
  AlertCircle, 
  Users, 
  FileText, 
  DollarSign, 
  CreditCard,
  Package, 
  Activity 
} from 'lucide-react';
import { formatCurrency } from '../utils';

/**
 * Enhanced Stats Grid - 8 cards for comprehensive dashboard overview
 * @param {Object} props Component props
 * @param {Object} props.data Dashboard summary data
 * @returns {JSX.Element} Enhanced stats grid UI
 */
const EnhancedStatsGrid = ({ data }) => {
  if (!data) return null;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* 1. Projects */}
      <StatsCard
        title="Total Proyek"
        value={data.projects?.total || 0}
        subtitle={`${data.projects?.active || 0} aktif`}
        icon={Building}
        color="blue"
        trend={data.projects?.completed > 0 ? `${data.projects.completed} selesai` : null}
      />
      
      {/* 2. Pending Approvals - URGENT */}
      <StatsCard
        title="Persetujuan Tertunda"
        value={data.approvals?.total || 0}
        subtitle={data.approvals?.rab?.urgent > 0 || data.approvals?.progressPayments?.urgent > 0 
          ? `⚠️ ${(data.approvals.rab?.urgent || 0) + (data.approvals.progressPayments?.urgent || 0)} mendesak!` 
          : 'Semua terkendali'}
        icon={AlertCircle}
        color="orange"
        trend={data.approvals?.rab?.pending > 0 ? `${data.approvals.rab.pending} RAB tertunda` : null}
        urgent={data.approvals?.rab?.urgent > 0 || data.approvals?.progressPayments?.urgent > 0}
      />
      
      {/* 3. Attendance Today */}
      <StatsCard
        title="Absensi Hari Ini"
        value={data.attendance?.today?.present || 0}
        subtitle={`dari ${data.attendance?.today?.total || 0} karyawan`}
        icon={Users}
        color="green"
        trend={data.attendance?.today?.absent > 0 
          ? `${data.attendance.today.absent} tidak hadir` 
          : 'Semua hadir'}
      />
      
      {/* 4. Pending Documents */}
      <StatsCard
        title="Dokumen Tertunda"
        value={(data.documents?.pending?.ba || 0) + (data.documents?.pending?.deliveryReceipts || 0)}
        subtitle={`${data.documents?.pending?.ba || 0} BA, ${data.documents?.pending?.deliveryReceipts || 0} Tanda Terima`}
        icon={FileText}
        color="purple"
      />
      
      {/* 5. Budget Overview */}
      <StatsCard
        title="Total Anggaran"
        value={formatCurrency(data.financial?.budget?.total || 0)}
        subtitle={`${data.financial?.budget?.percentage || 0}% terpakai`}
        icon={DollarSign}
        color="cyan"
        trend={`${formatCurrency(data.financial?.budget?.remaining || 0)} tersisa`}
      />
      
      {/* 6. Outstanding Payments */}
      <StatsCard
        title="Pembayaran Tertunda"
        value={data.financial?.payments?.pending || 0}
        subtitle={data.financial?.payments?.overdue > 0 
          ? `⚠️ ${data.financial.payments.overdue} terlambat!` 
          : 'Semua on-time'}
        icon={CreditCard}
        color="yellow"
        trend={formatCurrency(data.financial?.payments?.totalAmount || 0)}
        urgent={data.financial?.payments?.overdue > 0}
      />
      
      {/* 7. Material Items */}
      <StatsCard
        title="Material"
        value={data.materials?.total || 0}
        subtitle={data.materials?.lowStock > 0 
          ? `${data.materials.lowStock} stok rendah` 
          : 'Stok aman'}
        icon={Package}
        color="red"
        trend={data.materials?.outOfStock > 0 
          ? `⚠️ ${data.materials.outOfStock} habis!` 
          : null}
        urgent={data.materials?.outOfStock > 0}
      />
      
      {/* 8. Activities Today */}
      <StatsCard
        title="Aktivitas Hari Ini"
        value={data.activities?.today || 0}
        subtitle="transaksi & log"
        icon={Activity}
        color="indigo"
      />
    </div>
  );
};

export default EnhancedStatsGrid;
