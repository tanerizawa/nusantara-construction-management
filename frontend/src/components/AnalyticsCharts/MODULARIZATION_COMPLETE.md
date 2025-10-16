# AnalyticsCharts Component Modularization

This document describes the modularization of the `AnalyticsCharts` component.

## Structure

The modularized `AnalyticsCharts` component now follows a structured organization:

```
/components/AnalyticsCharts/
  ├── components/
  │   ├── charts/
  │   │   ├── StockMovementChart.js
  │   │   ├── CategoryDistributionChart.js
  │   │   ├── SupplierPerformanceChart.js
  │   │   ├── WarehouseUtilizationChart.js
  │   │   └── PurchaseOrderTrendChart.js
  │   ├── ChartCard.js
  │   └── ChartGrid.js
  ├── config/
  │   └── chartConfig.js
  ├── hooks/
  │   └── useChartData.js
  ├── utils/
  │   └── chartUtils.js
  ├── AnalyticsCharts.js
  └── index.js
```

## Features

- **Modular Chart Components**: Each chart is now a standalone component
- **Reusable Chart Card**: Common container for consistent styling
- **Chart Grid Layout**: Flexible grid system for arranging charts
- **Configuration**: Centralized configuration for colors, styles and mock data
- **Hooks**: Custom hooks for data fetching and chart responsiveness
- **Utility Functions**: Reusable functions for formatting and calculations

## Benefits

1. **Improved Maintainability**: Each chart can be updated independently
2. **Better Reusability**: Charts can be used individually in other components
3. **Enhanced Testability**: Smaller components are easier to test
4. **Clear Separation of Concerns**: Data, presentation, and configuration are separated
5. **Consistent Styling**: Shared styles through configuration
6. **Backward Compatibility**: Original API is preserved through re-exports

## Usage

```jsx
// Use the main component (backward compatible)
import AnalyticsCharts from '../components/AnalyticsCharts';

// Or import individual components
import { 
  StockMovementChart, 
  CategoryDistributionChart 
} from '../components/AnalyticsCharts';

// Use with custom data
const data = {
  stockMovement: [...],
  categoryDistribution: [...]
};

<AnalyticsCharts data={data} />
```