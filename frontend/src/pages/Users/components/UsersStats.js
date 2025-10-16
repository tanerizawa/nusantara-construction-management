import React from 'react';
import { User, Shield, UserCheck } from 'lucide-react';
import { KPICard } from '../../../components/ui/Card';
import { useTranslation } from '../../../i18n';

/**
 * Component for displaying user statistics
 */
const UsersStats = ({ stats, serverCount }) => {
  const { users } = useTranslation();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <KPICard
        title={users.stats.totalUsers}
        value={stats?.total ?? serverCount}
        icon={User}
        color="blue"
      />
      <KPICard
        title={users.stats.activeUsers}
        value={stats?.active ?? '-'}
        icon={UserCheck}
        color="green"
      />
      <KPICard
        title={users.stats.administrators}
        value={stats?.byRole?.admin ?? '-'}
        icon={Shield}
        color="red"
      />
      <KPICard
        title={users.stats.managers}
        value={
          (stats?.byRole?.project_manager || 0) +
          (stats?.byRole?.finance_manager || 0) +
          (stats?.byRole?.inventory_manager || 0) +
          (stats?.byRole?.hr_manager || 0)
        }
        icon={User}
        color="purple"
      />
    </div>
  );
};

export default UsersStats;