import React, { useState } from 'react';
import { Info, ChevronDown, ChevronUp, CheckCircle } from 'lucide-react';

/**
 * Payment Workflow Guide Component
 * Shows the standard payment workflow process
 */
const PaymentWorkflowGuide = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const steps = [
    {
      number: 1,
      title: 'Work Completion',
      description: 'Milestone pekerjaan selesai 100%',
      status: 'completed'
    },
    {
      number: 2,
      title: 'Create Berita Acara (BA)',
      description: 'Dokumentasi penyelesaian pekerjaan',
      status: 'completed'
    },
    {
      number: 3,
      title: 'BA Approval',
      description: 'Client/PM approve BA',
      status: 'completed'
    },
    {
      number: 4,
      title: 'Create Progress Payment',
      description: 'Kontraktor buat request pembayaran',
      status: 'current',
      highlight: true
    },
    {
      number: 5,
      title: 'Payment Approval',
      description: 'Client/Finance approve payment',
      status: 'pending'
    },
    {
      number: 6,
      title: 'Generate Invoice',
      description: 'System auto-generate invoice',
      status: 'pending'
    },
    {
      number: 7,
      title: 'Send Invoice',
      description: 'Kirim invoice ke client',
      status: 'pending'
    },
    {
      number: 8,
      title: 'Payment Received',
      description: 'Client transfer pembayaran',
      status: 'pending'
    },
    {
      number: 9,
      title: 'Mark as Paid',
      description: 'Update status payment',
      status: 'pending'
    }
  ];

  return (
    <div className="bg-[#2C2C2E] border border-[#38383A] rounded-lg overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-[#38383A]/30 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Info size={18} className="text-[#0A84FF]" />
          <span className="text-sm font-medium text-white">
            Payment & Invoice Workflow Guide
          </span>
        </div>
        {isExpanded ? (
          <ChevronUp size={18} className="text-[#8E8E93]" />
        ) : (
          <ChevronDown size={18} className="text-[#8E8E93]" />
        )}
      </button>

      {isExpanded && (
        <div className="px-4 py-4 border-t border-[#38383A]">
          <div className="space-y-3">
            {steps.map((step, index) => (
              <div
                key={step.number}
                className={`
                  flex items-start gap-3 p-3 rounded-lg transition-colors
                  ${step.highlight ? 'bg-[#0A84FF]/10 border border-[#0A84FF]/30' : 'bg-[#1C1C1E]'}
                `}
              >
                <div className={`
                  flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                  ${step.status === 'completed' ? 'bg-[#30D158] text-white' : 
                    step.status === 'current' ? 'bg-[#0A84FF] text-white' : 
                    'bg-[#48484A] text-[#8E8E93]'}
                `}>
                  {step.status === 'completed' ? (
                    <CheckCircle size={14} />
                  ) : (
                    step.number
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className={`
                      text-sm font-medium
                      ${step.highlight ? 'text-[#0A84FF]' : 
                        step.status === 'completed' ? 'text-[#30D158]' : 
                        'text-white'}
                    `}>
                      {step.title}
                    </h4>
                    {step.highlight && (
                      <span className="px-2 py-0.5 bg-[#0A84FF] text-white text-xs rounded-full">
                        Anda di sini
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#8E8E93]">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 bg-[#FF9500]/10 border border-[#FF9500]/30 rounded-lg">
            <p className="text-xs text-[#FF9500] leading-relaxed">
              <strong>💡 Catatan Penting:</strong> Invoice akan di-generate otomatis setelah 
              Progress Payment disetujui. Anda tidak perlu membuat invoice secara manual.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentWorkflowGuide;
