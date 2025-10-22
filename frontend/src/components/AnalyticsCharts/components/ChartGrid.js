import React from 'react';
import ChartCard from './ChartCard';
import StockMovementChart from './charts/StockMovementChart';
import CategoryDistributionChart from './charts/CategoryDistributionChart';
import SupplierPerformanceChart from './charts/SupplierPerformanceChart';
import WarehouseUtilizationChart from './charts/WarehouseUtilizationChart';
import PurchaseOrderTrendChart from './charts/PurchaseOrderTrendChart';
import { CHART_MOCK_DATA } from '../config/chartConfig';
import { useChartData } from '../hooks/useChartData';
import { useTranslation } from '../../../i18n';

/**
 * ChartGrid Component
 * Layout grid for all analytics charts
 * 
 * @param {Object} props - Component props
 * @param {Object} props.data - Optional data to override mock data
 * @param {function} props.fetchFn - Optional API fetch function
 */
const ChartGrid = ({ data = {}, fetchFn = null }) => {
  const { analytics } = useTranslation();
  const { 
    data: stockMovementData 
  } = useChartData('stockMovement', CHART_MOCK_DATA.stockMovement, fetchFn);
  
  const { 
    data: categoryDistributionData 
  } = useChartData('categoryDistribution', CHART_MOCK_DATA.categoryDistribution, fetchFn);
  
  const { 
    data: supplierPerformanceData 
  } = useChartData('supplierPerformance', CHART_MOCK_DATA.supplierPerformance, fetchFn);
  
  const { 
    data: warehouseUtilizationData 
  } = useChartData('warehouseUtilization', CHART_MOCK_DATA.warehouseUtilization, fetchFn);
  
  const { 
    data: purchaseOrderTrendData 
  } = useChartData('purchaseOrderTrend', CHART_MOCK_DATA.purchaseOrderTrend, fetchFn);

  return (
    <div className="space-y-6">
      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Distribution */}
        <ChartCard title={analytics.chartTitles.budgetAllocation}>
          <CategoryDistributionChart 
            data={(data.categoryDistribution ?? categoryDistributionData)} 
          />
        </ChartCard>

        {/* Warehouse Utilization */}
        <ChartCard title={analytics.chartTitles.resourceUtilization}>
          <WarehouseUtilizationChart 
            data={(data.warehouseUtilization ?? warehouseUtilizationData)} 
          />
        </ChartCard>
      </div>

      {/* Additional Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Supplier Performance */}
        <ChartCard title={analytics.chartTitles.projectPerformance}>
          <SupplierPerformanceChart 
            data={(data.supplierPerformance ?? supplierPerformanceData)} 
          />
        </ChartCard>

        {/* Purchase Order Trend */}
        <ChartCard title={analytics.chartTitles.timeline}>
          <PurchaseOrderTrendChart 
            data={(data.purchaseOrderTrend ?? purchaseOrderTrendData)} 
          />
        </ChartCard>
      </div>
      
      {/* Full Width Chart */}
      <ChartCard title={analytics.chartTitles.projectPerformance}>
        <StockMovementChart 
          data={(data.stockMovement ?? stockMovementData)} 
        />
      </ChartCard>
    </div>
  );
};

export default ChartGrid;
