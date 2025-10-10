import React, { useMemo } from 'react';
import { Activity, CheckCircle, ShoppingCart, Package, FileText, ClipboardCheck } from 'lucide-react';
import { formatDate } from '../utils';

/**
 * Recent Activity Component
 * Displays recent project activities aggregated from multiple sources
 * 
 * UPDATED (Oct 10, 2025):
 * - Aggregates activities from RAB, PO, Delivery Receipts, and Berita Acara
 * - Shows latest 5 activities sorted by timestamp
 * - Uses proper icons and colors for each activity type
 */
const RecentActivity = ({ project, workflowData }) => {
  // Aggregate activities from multiple sources
  const activities = useMemo(() => {
    const acts = [];
    
    // Add RAB approvals
    workflowData?.rabStatus?.data?.forEach(rab => {
      if (rab.approvedAt) {
        acts.push({
          type: 'approval',
          title: 'RAB Item disetujui',
          description: rab.description || 'Item budget',
          timestamp: rab.approvedAt,
          icon: CheckCircle,
          color: '#30D158'
        });
      }
    });
    
    // Add PO creations
    workflowData?.purchaseOrders?.forEach(po => {
      acts.push({
        type: 'purchase',
        title: 'Purchase Order dibuat',
        description: `PO: ${po.poNumber || 'N/A'}`,
        timestamp: po.createdAt,
        icon: ShoppingCart,
        color: '#0A84FF'
      });
    });
    
    // Add delivery receipts
    workflowData?.deliveryReceipts?.forEach(dr => {
      acts.push({
        type: 'delivery',
        title: 'Material diterima',
        description: `${dr.items?.length || 0} items dari ${dr.supplier || 'supplier'}`,
        timestamp: dr.createdAt,
        icon: Package,
        color: '#BF5AF2'
      });
    });
    
    // Add Berita Acara if available
    workflowData?.beritaAcara?.forEach(ba => {
      acts.push({
        type: 'document',
        title: 'Berita Acara dibuat',
        description: ba.title || ba.description || 'Dokumen resmi',
        timestamp: ba.createdAt,
        icon: ClipboardCheck,
        color: '#FF9F0A'
      });
    });
    
    // Add project creation
    if (project.createdAt) {
      acts.push({
        type: 'creation',
        title: 'Proyek dibuat',
        description: project.projectName,
        timestamp: project.createdAt,
        icon: FileText,
        color: '#8E8E93'
      });
    }
    
    // Sort by timestamp descending, take latest 5
    return acts.sort((a, b) => 
      new Date(b.timestamp) - new Date(a.timestamp)
    ).slice(0, 5);
  }, [project, workflowData]);
  
  return (
    <div className="bg-[#2C2C2E] rounded-lg border border-[#38383A] overflow-hidden">
      <div className="px-4 py-3 bg-[#1C1C1E] border-b border-[#38383A]">
        <h3 className="text-base font-semibold text-white flex items-center">
          <Activity className="h-5 w-5 mr-2 text-[#0A84FF]" />
          Aktivitas Terbaru
        </h3>
      </div>
      <div className="p-4">
        {activities.length > 0 ? (
          <div className="space-y-3">
            {activities.map((activity, index) => {
              const IconComponent = activity.icon;
              return (
                <div key={index} className="flex items-start space-x-3 p-3 hover:bg-[#1C1C1E] rounded-lg transition-colors">
                  <div 
                    className="p-1.5 rounded-lg flex-shrink-0" 
                    style={{ backgroundColor: `${activity.color}20` }}
                  >
                    <IconComponent 
                      className="h-4 w-4" 
                      style={{ color: activity.color }} 
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {activity.title}
                    </p>
                    <p className="text-xs text-[#8E8E93] truncate">
                      {activity.description}
                    </p>
                    <p className="text-xs text-[#98989D] mt-1">
                      {formatDate(activity.timestamp)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-6">
            <Activity className="h-12 w-12 mx-auto text-[#3A3A3C] mb-2" />
            <p className="text-sm text-[#8E8E93]">Belum ada aktivitas</p>
            <p className="text-xs text-[#98989D] mt-1">
              Aktivitas akan muncul saat Anda membuat RAB, PO, atau menerima material
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentActivity;
