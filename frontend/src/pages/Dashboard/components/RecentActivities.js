import React from 'react';
import { Activity, Building, ShoppingCart, CheckCircle, AlertTriangle } from 'lucide-react';

/**
 * Recent activities component
 * @param {Object} props Component props
 * @param {Array} props.activities Recent activities data
 * @returns {JSX.Element} Recent activities UI
 */
const RecentActivities = ({ activities = [] }) => {
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
  
  return (
    <div className="lg:col-span-2 bg-[#2C2C2E] border border-[#38383A] p-6 rounded-xl hover:border-[#48484A] transition-colors">
      <h3 className="text-lg font-semibold text-white mb-4">Aktivitas Terbaru</h3>
      <div className="space-y-4">
        {activities.length === 0 ? (
          <div className="text-center py-8 text-[#636366]">
            <Activity className="h-8 w-8 mx-auto mb-2 text-[#636366]" />
            <p>Belum ada aktivitas terbaru</p>
          </div>
        ) : (
          activities.map((activity, index) => (
            <div key={index} className="flex items-start space-x-3 py-3 border-b border-[#38383A] last:border-b-0">
              <div className="flex-shrink-0">
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white">{activity.title}</p>
                <p className="text-sm text-[#98989D]">{activity.description}</p>
                <p className="text-xs text-[#636366] mt-1">{activity.timestamp}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RecentActivities;