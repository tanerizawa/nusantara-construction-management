import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { RefreshCw, CalendarDays, Activity, Shield } from 'lucide-react';
import { formatCurrency } from '../utils';

/**
 * Header untuk halaman dashboard
 * @param {Object} props Component props
 * @param {boolean} props.loading Loading state
 * @param {Function} props.onRefresh Function untuk refresh data
 * @returns {JSX.Element} Dashboard header UI
 */
const DashboardHeader = ({ loading, onRefresh, insightData }) => {
  const navigate = useNavigate();
  const now = new Date();
  const formattedDate = now.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const formattedTime = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

  const headerStats = useMemo(() => {
    const approvalsTotal = insightData?.approvals?.total || 0;
    const urgentApprovals = (insightData?.approvals?.rab?.urgent || 0) + (insightData?.approvals?.progressPayments?.urgent || 0);
    const attendanceData = insightData?.attendance?.today;
    const attendanceRate = attendanceData?.total
      ? Math.round((attendanceData.present / attendanceData.total) * 100)
      : 0;
    const remainingBudget = formatCurrency(insightData?.financial?.budget?.remaining || 0);

    return [
      {
        id: 'approvals',
        label: 'Approval Pending',
        value: `${approvalsTotal} item`,
        tone: urgentApprovals > 0 ? 'text-[#fb7185]' : 'text-[#34d399]',
        meta: urgentApprovals > 0 ? `${urgentApprovals} prioritas tinggi` : 'Semua on-track'
      },
      {
        id: 'attendance',
        label: 'Absensi Hari Ini',
        value: attendanceData?.present ? `${attendanceData.present} hadir` : 'Tidak ada data',
        tone: 'text-[#60a5fa]',
        meta: attendanceData?.total ? `${attendanceRate}% dari ${attendanceData.total} tim` : 'Menunggu update'
      },
      {
        id: 'budget',
        label: 'Anggaran Tersisa',
        value: remainingBudget,
        tone: 'text-[#f472b6]',
        meta: `${insightData?.financial?.budget?.percentage || 0}% terpakai`
      }
    ];
  }, [insightData]);

  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/5 bg-[#0c1018]/80 px-6 py-5 shadow-[0_25px_60px_rgba(0,0,0,0.45)] backdrop-blur-xl">
      <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-gradient-to-br from-[#0ea5e9]/40 to-[#8b5cf6]/40 blur-3xl" />
      <div className="pointer-events-none absolute -left-10 top-0 h-36 w-36 rounded-full bg-[#34d399]/20 blur-3xl" />

      <div className="relative flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div className="max-w-2xl">
          <p className="eyebrow-label">Panel Admin</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">Dasbor Operasional</h1>
          <p className="mt-2 text-sm text-white/60">
            Pemantauan real-time proyek, persetujuan, dan cashflow Nusantara Group
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-white/50">
            <span className="inline-flex items-center gap-1 rounded-full border border-white/10 px-3 py-1">
              <CalendarDays size={14} />
              {formattedDate}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-white/10 px-3 py-1">
              <Activity size={14} />
              {formattedTime} WIB
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => navigate('/analytics')}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 px-5 py-3 text-sm font-medium text-white/80 transition hover:border-white/40 hover:text-white"
          >
            <Shield size={16} />
            Lihat Pelacakan
          </button>
          <button 
            onClick={onRefresh}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#0ea5e9] via-[#2563eb] to-[#7c3aed] px-6 py-3 text-sm font-semibold text-white shadow-[0_15px_30px_rgba(14,165,233,0.25)] transition hover:brightness-110 disabled:opacity-60"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Segarkan
          </button>
        </div>
      </div>

      <div className="relative mt-6 grid gap-3 md:grid-cols-3">
        {headerStats.map((stat) => (
          <div key={stat.id} className="rounded-2xl border border-white/5 bg-white/5 px-4 py-3 backdrop-blur">
            <p className="text-[11px] uppercase tracking-[0.2em] text-white/50 break-words">{stat.label}</p>
            <p className={`mt-2 text-lg font-semibold break-words ${stat.tone}`}>{stat.value}</p>
            <p className="text-xs text-white/60 break-words">{stat.meta}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default DashboardHeader;
