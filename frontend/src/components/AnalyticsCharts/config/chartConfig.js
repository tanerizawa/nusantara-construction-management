// Mock data configurations for charts
export const CHART_MOCK_DATA = {
  stockMovement: [
    { name: 'Jan', stockIn: 4000, stockOut: 2400, net: 1600 },
    { name: 'Feb', stockIn: 3000, stockOut: 1398, net: 1602 },
    { name: 'Mar', stockIn: 2000, stockOut: 9800, net: -7800 },
    { name: 'Apr', stockIn: 2780, stockOut: 3908, net: -1128 },
    { name: 'May', stockIn: 1890, stockOut: 4800, net: -2910 },
    { name: 'Jun', stockIn: 2390, stockOut: 3800, net: -1410 },
    { name: 'Jul', stockIn: 3490, stockOut: 4300, net: -810 },
  ],
  
  categoryDistribution: [
    { name: 'Semen & Agregat', value: 35, count: 145 },
    { name: 'Besi & Baja', value: 25, count: 98 },
    { name: 'Safety Equipment', value: 15, count: 67 },
    { name: 'Alat Konstruksi', value: 12, count: 45 },
    { name: 'Cat & Finishing', value: 8, count: 34 },
    { name: 'Lainnya', value: 5, count: 23 },
  ],
  
  supplierPerformance: [
    { name: 'PT Semen Indonesia', orders: 24, onTime: 22, rating: 4.8 },
    { name: 'CV Baja Konstruksi', orders: 18, onTime: 16, rating: 4.5 },
    { name: 'Safety Equipment Pro', orders: 15, onTime: 14, rating: 4.6 },
    { name: 'Toko Alat Berat Jaya', orders: 12, onTime: 9, rating: 3.8 },
    { name: 'Material Center', orders: 20, onTime: 18, rating: 4.3 },
  ],
  
  warehouseUtilization: [
    { name: 'Gudang A', capacity: 1000, used: 750, utilization: 75 },
    { name: 'Gudang B', capacity: 800, used: 640, utilization: 80 },
    { name: 'Gudang C', capacity: 600, used: 420, utilization: 70 },
    { name: 'Gudang D', capacity: 1200, used: 960, utilization: 80 },
    { name: 'Gudang E', capacity: 900, used: 540, utilization: 60 },
  ],
  
  purchaseOrderTrend: [
    { month: 'Jan', orders: 45, value: 125000000 },
    { month: 'Feb', orders: 52, value: 145000000 },
    { month: 'Mar', orders: 38, value: 98000000 },
    { month: 'Apr', orders: 61, value: 178000000 },
    { month: 'May', orders: 55, value: 156000000 },
    { month: 'Jun', orders: 67, value: 189000000 },
    { month: 'Jul', orders: 72, value: 205000000 },
  ]
};

// Chart color configuration
export const CHART_COLORS = {
  primary: '#3B82F6',
  success: '#10B981',
  danger: '#EF4444',
  warning: '#F59E0B',
  info: '#0088FE',
  purple: '#8884D8',
  teal: '#00C49F',
  amber: '#FFBB28',
  orange: '#FF8042',
  navy: '#0F172A'
};

// Chart style configuration
export const CHART_STYLES = {
  backgroundColor: '#2C2C2E',
  borderColor: '#38383A',
  textColor: '#FFFFFF',
  secondaryTextColor: '#98989D',
  strokeDasharray: '3 3',
  borderRadius: '8px',
  tooltipStyles: {
    backgroundColor: '#2C2C2E', 
    border: '1px solid #38383A', 
    borderRadius: '8px', 
    color: '#FFFFFF'
  }
};

// Category pie chart colors
export const PIE_CHART_COLORS = [
  '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'
];

export default {
  CHART_MOCK_DATA,
  CHART_COLORS,
  CHART_STYLES,
  PIE_CHART_COLORS
};