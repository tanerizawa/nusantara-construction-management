import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Building, ShoppingCart, CheckCircle, AlertTriangle } from 'lucide-react';

/**
 * Recent activities component
 * @param {Object} props Component props
 * @param {Array} props.activities Recent activities data
 * @returns {JSX.Element} Recent activities UI
 */
const RecentActivities = ({ activities = [] }) => {
  const navigate = useNavigate();
  // Map activity types to their respective icons
  const getActivityIcon = (type) => {
    switch (type) {
      case 'project':
        return <Building className="h-5 w-5 text-[#0A84FF]" />;
      case 'purchase_order':
        return <ShoppingCart className="h-5 w-5 text-[#30D158]" />;
      case 'approval':
        return <CheckCircle className="h-5 w-5 text-[#30D158]" />;
      case 'alert':
        return <AlertTriangle className="h-5 w-5 text-[#FF9F0A]" />;
      default:
        return <Activity className="h-5 w-5 text-[#98989D]" />;
    }
  };
  
  const formatTimestamp = (ts) => {
    if (!ts) return '';
    try {
      const d = new Date(ts);
      return d.toLocaleString('id-ID');
    } catch (_) {
      return String(ts);
    }
  };

  return (
    <div className="xl:col-span-2 rounded-3xl border border-white/5 bg-[#090d16]/85 p-6 shadow-[0_25px_60px_rgba(0,0,0,0.45)] backdrop-blur-xl">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">Aktivitas Terbaru</h3>
          <p className="text-xs text-white/50">Log sistem dan aktivitas proyek 24 jam terakhir</p>
        </div>
        <button
          onClick={() => navigate('/notifications')}
          className="text-xs font-semibold uppercase tracking-[0.3em] text-white/50 transition hover:text-white"
        >
          Lihat log
        </button>
      </div>
      <div className="mt-5 space-y-4">
        {activities.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/5 py-10 text-white/60">
            <Activity className="mb-3 h-8 w-8" />
            <p>Belum ada aktivitas terbaru</p>
          </div>
        ) : (
          activities.map((activity, index) => (
            <div key={index} className="group relative overflow-hidden rounded-2xl border border-white/5 bg-white/5 p-4 transition hover:-translate-y-0.5 hover:border-white/20">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-white break-words">{activity.title || activity.description || activity.type || 'Aktivitas'}</p>
                    <span className="text-[11px] text-white/50">
                      {activity.type ? activity.type.replace('_', ' ') : 'log'}
                    </span>
                  </div>
                  {activity.description && (
                    <p className="text-xs text-white/60 break-words">{activity.description}</p>
                  )}
                  <p className="mt-2 text-[11px] text-white/40 break-words">{activity.timestamp || formatTimestamp(activity.date)}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RecentActivities;
