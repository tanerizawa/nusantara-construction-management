import React from 'react';
import { FileText, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { formatCurrency } from '../utils';

/**
 * Component for displaying tax statistics in cards
 * @param {Object} props Component props
 * @param {Object} props.stats Tax statistics data
 * @returns {JSX.Element} Statistics cards UI
 */
const StatsCards = ({ stats }) => {
  if (!stats) {
    return null;
  }

  const statCards = [
    {
      title: 'Total Pajak',
      value: stats.totalTax || 0,
      icon: FileText,
      color: 'blue'
    },
    {
      title: 'Sudah Dibayar',
      value: stats.paidTax || 0,
      icon: CheckCircle,
      color: 'green'
    },
    {
      title: 'Pending',
      value: stats.pendingTax || 0,
      icon: Clock,
      color: 'yellow'
    },
    {
      title: 'Terlambat',
      value: stats.overdueTax || 0,
      icon: AlertCircle,
      color: 'red'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {statCards.map((card, index) => (
        <div className="card" key={index}>
          <div className="flex items-center">
            <div className={`p-3 rounded-lg bg-${card.color}-50`}>
              <card.icon size={24} className={`text-${card.color}-600`} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">{card.title}</p>
              <p className={`text-xl font-bold text-${card.color}-600`}>
                {formatCurrency(card.value)}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;