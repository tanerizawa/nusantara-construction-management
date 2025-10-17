import React, { useMemo } from 'react';
import { 
  AlertTriangle, 
  AlertCircle, 
  Info,
  X,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { generateBudgetAlerts } from '../utils/varianceAnalysis';

/**
 * Budget Alerts Component
 * Displays budget warnings and notifications
 */
const BudgetAlerts = ({ summary, categoryBreakdown, rabItems }) => {
  const [collapsed, setCollapsed] = React.useState(false);

  // Generate alerts based on budget data
  const alerts = useMemo(() => {
    if (!summary) return [];
    return generateBudgetAlerts(summary, categoryBreakdown || [], rabItems || []);
  }, [summary, categoryBreakdown, rabItems]);

  // Filter alerts by severity
  const highSeverityAlerts = alerts.filter(a => a.severity === 'high');
  const mediumSeverityAlerts = alerts.filter(a => a.severity === 'medium');
  const lowSeverityAlerts = alerts.filter(a => a.severity === 'low');

  if (alerts.length === 0) {
    return (
      <div className="bg-[#30D158]/10 border border-[#30D158]/30 rounded-lg p-3">
        <div className="flex items-center">
          <Info className="text-[#30D158] mr-2 flex-shrink-0 w-4 h-4" />
          <div>
            <p className="text-sm font-medium text-white">
              Tidak ada peringatan
            </p>
            <p className="text-xs text-[#8E8E93] mt-0.5">
              Semua kategori dalam kondisi baik
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* Compact Header */}
      <div className="flex items-center justify-between bg-[#2C2C2E] border border-[#38383A] rounded-lg p-2.5">
        <h3 className="text-sm font-semibold text-white flex items-center">
          <AlertTriangle className="text-[#FF9F0A] mr-1.5 w-4 h-4" />
          Peringatan Anggaran
          <span className="ml-2 bg-[#FF9F0A]/20 text-[#FF9F0A] text-xs font-semibold px-1.5 py-0.5 rounded">
            {alerts.length}
          </span>
        </h3>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-[#8E8E93] hover:text-white transition-colors"
        >
          {collapsed ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Alerts List */}
      {!collapsed && (
        <div className="space-y-2">
          {/* High Severity Alerts */}
          {highSeverityAlerts.map((alert, index) => (
            <AlertCard key={`high-${index}`} alert={alert} />
          ))}

          {/* Medium Severity Alerts */}
          {mediumSeverityAlerts.map((alert, index) => (
            <AlertCard key={`medium-${index}`} alert={alert} />
          ))}

          {/* Low Severity Alerts */}
          {lowSeverityAlerts.map((alert, index) => (
            <AlertCard key={`low-${index}`} alert={alert} />
          ))}
        </div>
      )}

      {/* Summary when collapsed */}
      {collapsed && (
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {highSeverityAlerts.length > 0 && (
            <span className="text-red-600 dark:text-red-400 font-medium">
              {highSeverityAlerts.length} peringatan tinggi
            </span>
          )}
          {highSeverityAlerts.length > 0 && mediumSeverityAlerts.length > 0 && ', '}
          {mediumSeverityAlerts.length > 0 && (
            <span className="text-orange-600 dark:text-orange-400 font-medium">
              {mediumSeverityAlerts.length} peringatan sedang
            </span>
          )}
          {(highSeverityAlerts.length > 0 || mediumSeverityAlerts.length > 0) && lowSeverityAlerts.length > 0 && ', '}
          {lowSeverityAlerts.length > 0 && (
            <span className="text-blue-600 dark:text-blue-400 font-medium">
              {lowSeverityAlerts.length} informasi
            </span>
          )}
        </div>
      )}
    </div>
  );
};

/**
 * Individual Alert Card Component
 */
const AlertCard = ({ alert }) => {
  const [dismissed, setDismissed] = React.useState(false);

  if (dismissed) return null;

  const getAlertStyle = (type, severity) => {
    if (type === 'error' || severity === 'high') {
      return {
        bg: 'bg-[#FF453A]/10',
        border: 'border-[#FF453A]/30',
        icon: 'text-[#FF453A]',
        text: 'text-white',
        subText: 'text-[#8E8E93]',
        Icon: AlertCircle
      };
    } else if (type === 'warning' || severity === 'medium') {
      return {
        bg: 'bg-[#FF9F0A]/10',
        border: 'border-[#FF9F0A]/30',
        icon: 'text-[#FF9F0A]',
        text: 'text-white',
        subText: 'text-[#8E8E93]',
        Icon: AlertTriangle
      };
    } else {
      return {
        bg: 'bg-[#0A84FF]/10',
        border: 'border-[#0A84FF]/30',
        icon: 'text-[#0A84FF]',
        text: 'text-white',
        subText: 'text-[#8E8E93]',
        Icon: Info
      };
    }
  };

  const style = getAlertStyle(alert.type, alert.severity);
  const Icon = style.Icon;

  return (
    <div className={`${style.bg} border ${style.border} rounded-lg p-3 transition-all duration-200`}>
      <div className="flex items-start">
        <Icon className={`${style.icon} mr-2 mt-0.5 flex-shrink-0 w-4 h-4`} />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className={`text-sm font-semibold ${style.text}`}>
                {alert.title}
              </p>
              <p className={`text-xs ${style.subText} mt-0.5`}>
                {alert.message}
              </p>
            </div>
            
            <button
              onClick={() => setDismissed(true)}
              className={`${style.icon} hover:opacity-70 transition-opacity ml-2 flex-shrink-0`}
              title="Tutup"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {alert.value !== undefined && (
            <div className={`text-xs ${style.subText} mt-1.5 font-medium`}>
              Nilai: {formatCurrency(alert.value)}
            </div>
          )}

          {alert.count !== undefined && (
            <div className={`text-xs ${style.subText} mt-1.5 font-medium`}>
              Jumlah: {alert.count} item
            </div>
          )}

          {alert.category && (
            <div className={`text-xs ${style.subText} mt-1`}>
              Kategori: <span className="font-semibold text-white">{alert.category}</span>
            </div>
          )}

          {alert.action && (
            <div className="mt-2 pt-2 border-t border-[#38383A]">
              <p className={`text-xs ${style.text} font-medium flex items-center`}>
                <Info className="mr-1 w-3 h-3" />
                Tindakan: {alert.action}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * Format currency
 */
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

export default BudgetAlerts;
