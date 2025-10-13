import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';

/**
 * Analytics Charts Component
 * Reusable chart components for dashboard analytics
 */

const StockMovementChart = ({ data }) => {
  const defaultData = [
    { name: 'Jan', stockIn: 4000, stockOut: 2400, net: 1600 },
    { name: 'Feb', stockIn: 3000, stockOut: 1398, net: 1602 },
    { name: 'Mar', stockIn: 2000, stockOut: 9800, net: -7800 },
    { name: 'Apr', stockIn: 2780, stockOut: 3908, net: -1128 },
    { name: 'May', stockIn: 1890, stockOut: 4800, net: -2910 },
    { name: 'Jun', stockIn: 2390, stockOut: 3800, net: -1410 },
    { name: 'Jul', stockIn: 3490, stockOut: 4300, net: -810 },
  ];

  const chartData = data || defaultData;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#38383A" />
        <XAxis dataKey="name" stroke="#98989D" />
        <YAxis stroke="#98989D" />
        <Tooltip 
          formatter={(value) => new Intl.NumberFormat('id-ID').format(value)}
          contentStyle={{ backgroundColor: '#2C2C2E', border: '1px solid #38383A', borderRadius: '8px', color: '#FFFFFF' }}
        />
        <Legend wrapperStyle={{ color: '#98989D' }} />
        <Area type="monotone" dataKey="stockIn" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.8} />
        <Area type="monotone" dataKey="stockOut" stackId="1" stroke="#EF4444" fill="#EF4444" fillOpacity={0.8} />
      </AreaChart>
    </ResponsiveContainer>
  );
};

const CategoryDistributionChart = ({ data }) => {
  const defaultData = [
    { name: 'Semen & Agregat', value: 35, count: 145 },
    { name: 'Besi & Baja', value: 25, count: 98 },
    { name: 'Safety Equipment', value: 15, count: 67 },
    { name: 'Alat Konstruksi', value: 12, count: 45 },
    { name: 'Cat & Finishing', value: 8, count: 34 },
    { name: 'Lainnya', value: 5, count: 23 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];
  const chartData = data || defaultData;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip 
          formatter={(value, name) => [`${value}%`, name]}
          contentStyle={{ backgroundColor: '#2C2C2E', border: '1px solid #38383A', borderRadius: '8px', color: '#FFFFFF' }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

const SupplierPerformanceChart = ({ data }) => {
  const defaultData = [
    { name: 'PT Semen Indonesia', orders: 24, onTime: 22, rating: 4.8 },
    { name: 'CV Baja Konstruksi', orders: 18, onTime: 16, rating: 4.5 },
    { name: 'Safety Equipment Pro', orders: 15, onTime: 14, rating: 4.6 },
    { name: 'Toko Alat Berat Jaya', orders: 12, onTime: 9, rating: 3.8 },
    { name: 'Material Center', orders: 20, onTime: 18, rating: 4.3 },
  ];

  const chartData = data || defaultData;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#38383A" />
        <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} stroke="#98989D" />
        <YAxis stroke="#98989D" />
        <Tooltip contentStyle={{ backgroundColor: '#2C2C2E', border: '1px solid #38383A', borderRadius: '8px', color: '#FFFFFF' }} />
        <Legend wrapperStyle={{ color: '#98989D' }} />
        <Bar dataKey="orders" fill="#3B82F6" name="Total Orders" />
        <Bar dataKey="onTime" fill="#10B981" name="On Time Delivery" />
      </BarChart>
    </ResponsiveContainer>
  );
};

const WarehouseUtilizationChart = ({ data }) => {
  const defaultData = [
    { name: 'Gudang A', capacity: 1000, used: 750, utilization: 75 },
    { name: 'Gudang B', capacity: 800, used: 640, utilization: 80 },
    { name: 'Gudang C', capacity: 600, used: 420, utilization: 70 },
    { name: 'Gudang D', capacity: 1200, used: 960, utilization: 80 },
    { name: 'Gudang E', capacity: 900, used: 540, utilization: 60 },
  ];

  const chartData = data || defaultData;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData} layout="horizontal">
        <CartesianGrid strokeDasharray="3 3" stroke="#38383A" />
        <XAxis type="number" domain={[0, 100]} stroke="#98989D" />
        <YAxis dataKey="name" type="category" width={80} stroke="#98989D" />
        <Tooltip 
          formatter={(value) => `${value}%`}
          contentStyle={{ backgroundColor: '#2C2C2E', border: '1px solid #38383A', borderRadius: '8px', color: '#FFFFFF' }}
        />
        <Legend wrapperStyle={{ color: '#98989D' }} />
        <Bar dataKey="utilization" fill="#8884D8" name="Utilization %" />
      </BarChart>
    </ResponsiveContainer>
  );
};

const PurchaseOrderTrendChart = ({ data }) => {
  const defaultData = [
    { month: 'Jan', orders: 45, value: 125000000 },
    { month: 'Feb', orders: 52, value: 145000000 },
    { month: 'Mar', orders: 38, value: 98000000 },
    { month: 'Apr', orders: 61, value: 178000000 },
    { month: 'May', orders: 55, value: 156000000 },
    { month: 'Jun', orders: 67, value: 189000000 },
    { month: 'Jul', orders: 72, value: 205000000 },
  ];

  const chartData = data || defaultData;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#38383A" />
        <XAxis dataKey="month" stroke="#98989D" />
        <YAxis yAxisId="left" stroke="#98989D" />
        <YAxis yAxisId="right" orientation="right" stroke="#98989D" tickFormatter={(value) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value)} />
        <Tooltip 
          formatter={(value, name) => {
            if (name === 'value') {
              return [new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value), 'Total Value'];
            }
            return [value, 'Total Orders'];
          }}
          contentStyle={{ backgroundColor: '#2C2C2E', border: '1px solid #38383A', borderRadius: '8px', color: '#FFFFFF' }}
        />
        <Legend wrapperStyle={{ color: '#98989D' }} />
        <Bar yAxisId="left" dataKey="orders" fill="#3B82F6" name="Orders Count" />
        <Line yAxisId="right" type="monotone" dataKey="value" stroke="#EF4444" strokeWidth={3} name="Total Value" />
      </LineChart>
    </ResponsiveContainer>
  );
};

// Main Analytics Charts Component
const AnalyticsCharts = () => {
  return (
    <div className="space-y-6">
      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Distribution */}
        <div className="p-6 rounded-lg shadow-lg" style={{ backgroundColor: "#2C2C2E", border: "1px solid #38383A" }}>
          <h3 className="text-lg font-semibold mb-4" style={{ color: "#FFFFFF" }}>Category Distribution</h3>
          <CategoryDistributionChart />
        </div>

        {/* Warehouse Utilization */}
        <div className="p-6 rounded-lg shadow-lg" style={{ backgroundColor: "#2C2C2E", border: "1px solid #38383A" }}>
          <h3 className="text-lg font-semibold mb-4" style={{ color: "#FFFFFF" }}>Warehouse Utilization</h3>
          <WarehouseUtilizationChart />
        </div>
      </div>

      {/* Additional Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Supplier Performance */}
        <div className="p-6 rounded-lg shadow-lg" style={{ backgroundColor: "#2C2C2E", border: "1px solid #38383A" }}>
          <h3 className="text-lg font-semibold mb-4" style={{ color: "#FFFFFF" }}>Supplier Performance</h3>
          <SupplierPerformanceChart />
        </div>

        {/* Purchase Order Trend */}
        <div className="p-6 rounded-lg shadow-lg" style={{ backgroundColor: "#2C2C2E", border: "1px solid #38383A" }}>
          <h3 className="text-lg font-semibold mb-4" style={{ color: "#FFFFFF" }}>Purchase Order Trend</h3>
          <PurchaseOrderTrendChart />
        </div>
      </div>
    </div>
  );
};

// Export individual chart components for reuse
export {
  StockMovementChart,
  CategoryDistributionChart,
  SupplierPerformanceChart,
  WarehouseUtilizationChart,
  PurchaseOrderTrendChart
};

export default AnalyticsCharts;
