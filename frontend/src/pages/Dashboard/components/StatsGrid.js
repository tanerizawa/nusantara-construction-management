import React from 'react';
import { StatsCard } from '../../../components/common/DashboardComponents';
import { Building, ShoppingCart, DollarSign, Package } from 'lucide-react';
import { formatCurrency } from '../utils';

/**
 * Grid statistik dashboard
 * @param {Object} props Component props
 * @param {Object} props.data Dashboard data
 * @returns {JSX.Element} Stats grid UI
 */
const StatsGrid = ({ data }) => {
  if (!data) return null;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatsCard
        title="Total Proyek"
        value={data.projects.total}
        subtitle={`${data.projects.active} aktif`}
        icon={Building}
        color="blue"
        trend="+12% dari bulan lalu"
      />
      
      <StatsCard
        title="Purchase Orders"
        value={data.purchaseOrders.total}
        subtitle={`${data.purchaseOrders.pending} pending`}
        icon={ShoppingCart}
        color="green"
        trend="+8% dari bulan lalu"
      />
      
      <StatsCard
        title="Total Budget"
        value={formatCurrency(data.budget.total)}
        subtitle={`${formatCurrency(data.budget.remaining)} tersisa`}
        icon={DollarSign}
        color="purple"
      />
      
      <StatsCard
        title="Material Items"
        value={data.materials.total}
        subtitle={`${data.materials.lowStock} stok rendah`}
        icon={Package}
        color="yellow"
      />
    </div>
  );
};

export default StatsGrid;