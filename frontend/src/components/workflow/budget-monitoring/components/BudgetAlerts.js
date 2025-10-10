import React from 'react';
import { AlertTriangle } from 'lucide-react';

/**
 * Component untuk menampilkan budget alerts
 */
const BudgetAlerts = ({ alerts = [] }) => {
  if (alerts.length === 0) return null;

  return (
    <div className="bg-[#FF3B30]/20 border border-[#FF3B30]/50 rounded-lg p-4">
      <div className="flex items-center mb-2">
        <AlertTriangle className="h-5 w-5 text-[#FF3B30] mr-2" />
        <h3 className="text-white font-medium">Budget Alerts</h3>
      </div>
      <div className="space-y-2">
        {alerts.map((alert, index) => (
          <div key={index} className="text-sm text-[#FF3B30]">
            • {alert.message}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BudgetAlerts;
