import React from 'react';
import { DollarSign, CheckCircle, TrendingUp, Clock } from 'lucide-react';
import { formatCurrency } from '../../../utils/formatters';

/**
 * Summary cards untuk payment overview
 */
const PaymentSummaryCards = ({ summary }) => {
  const cards = [
    {
      label: 'Total Amount',
      value: formatCurrency(summary.totalAmount),
      icon: DollarSign,
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-600',
      valueColor: 'text-blue-900'
    },
    {
      label: 'Dibayar',
      value: formatCurrency(summary.paidAmount),
      icon: CheckCircle,
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      textColor: 'text-green-600',
      valueColor: 'text-green-900'
    },
    {
      label: 'Disetujui',
      value: formatCurrency(summary.approvedAmount),
      icon: TrendingUp,
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      textColor: 'text-purple-600',
      valueColor: 'text-purple-900'
    },
    {
      label: 'Pending',
      value: formatCurrency(summary.pendingAmount),
      icon: Clock,
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      textColor: 'text-yellow-600',
      valueColor: 'text-yellow-900'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div key={index} className={`${card.bgColor} border ${card.borderColor} rounded-lg p-4`}>
            <div className="flex items-center">
              <Icon className={`h-8 w-8 ${card.textColor}`} />
              <div className="ml-3">
                <p className={`text-sm font-medium ${card.textColor}`}>{card.label}</p>
                <p className={`text-lg font-bold ${card.valueColor}`}>{card.value}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PaymentSummaryCards;
