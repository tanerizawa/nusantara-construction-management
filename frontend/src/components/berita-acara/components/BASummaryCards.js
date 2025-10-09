import React from 'react';
import { FileText, CheckCircle, Clock, DollarSign } from 'lucide-react';

/**
 * Komponen untuk menampilkan statistik ringkasan Berita Acara
 */
const BASummaryCards = ({ statistics }) => {
  const { total, pending, approved, paymentReady } = statistics;

  const cards = [
    {
      icon: FileText,
      label: 'Total BA',
      value: total,
      color: 'text-blue-500'
    },
    {
      icon: Clock,
      label: 'Pending',
      value: pending,
      color: 'text-yellow-500'
    },
    {
      icon: CheckCircle,
      label: 'Disetujui',
      value: approved,
      color: 'text-green-500'
    },
    {
      icon: DollarSign,
      label: 'Siap Bayar',
      value: paymentReady,
      color: 'text-emerald-500'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div key={index} className="bg-white p-4 rounded-lg border">
            <div className="flex items-center">
              <Icon className={`h-8 w-8 ${card.color}`} />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">{card.label}</p>
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BASummaryCards;
