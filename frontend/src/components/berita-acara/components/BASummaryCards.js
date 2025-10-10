import React from 'react';
import { FileText, CheckCircle, Clock, DollarSign } from 'lucide-react';

/**
 * Komponen untuk menampilkan statistik ringkasan Berita Acara
 * Dark theme version with iOS/macOS colors
 */
const BASummaryCards = ({ statistics }) => {
  const { total, pending, approved, paymentReady } = statistics;

  const cards = [
    {
      icon: FileText,
      label: 'Total BA',
      value: total,
      color: '#0A84FF',
      bgColor: 'rgba(10, 132, 255, 0.1)'
    },
    {
      icon: Clock,
      label: 'Pending',
      value: pending,
      color: '#FF9F0A',
      bgColor: 'rgba(255, 159, 10, 0.1)'
    },
    {
      icon: CheckCircle,
      label: 'Disetujui',
      value: approved,
      color: '#30D158',
      bgColor: 'rgba(48, 209, 88, 0.1)'
    },
    {
      icon: DollarSign,
      label: 'Siap Bayar',
      value: paymentReady,
      color: '#32D74B',
      bgColor: 'rgba(50, 215, 75, 0.1)'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div 
            key={index} 
            className="bg-[#2C2C2E] p-4 rounded-lg border border-[#38383A]"
          >
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: card.bgColor }}
              >
                <Icon size={20} style={{ color: card.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#8E8E93]">{card.label}</p>
                <p className="text-lg font-bold text-white">{card.value}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BASummaryCards;
