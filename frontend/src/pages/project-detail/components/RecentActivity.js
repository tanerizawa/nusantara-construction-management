import React, { useMemo } from 'react';
import { Activity, CheckCircle, ShoppingCart, Package, FileText, ClipboardCheck } from 'lucide-react';
import { formatDate } from '../utils';

/**
 * Recent Activity Component
 * Displays recent project activities aggregated from multiple sources
 * 
 * UPDATED (Oct 11, 2025):
 * - Optimized: Uses insertion sort for top-5 activities (O(n) vs O(n log n))
 * - Shows latest 5 activities sorted by timestamp
 * - Uses proper icons and colors for each activity type
 */
const RecentActivity = ({ project, workflowData }) => {
  // Optimized activity aggregation - maintains sorted top-5 list
  const activities = useMemo(() => {
    const maxActivities = 5;
    const topActivities = []; // Keep only top 5 sorted
    
    // Helper to insert activity in sorted position (if within top 5)
    const insertActivity = (activity) => {
      if (!activity.timestamp) return;
      
      const timestamp = new Date(activity.timestamp).getTime();
      
      // Find insertion point
      let insertIndex = topActivities.findIndex(
        a => new Date(a.timestamp).getTime() < timestamp
      );
      
      if (insertIndex === -1) {
        // Newer than all existing, or list is empty
        if (topActivities.length < maxActivities) {
          topActivities.push(activity);
        }
      } else {
        // Insert at position
        topActivities.splice(insertIndex, 0, activity);
        // Keep only top 5
        if (topActivities.length > maxActivities) {
          topActivities.pop();
        }
      }
    };
    
    // Add RAP approvals
    if (Array.isArray(workflowData?.rabStatus?.data)) {
      workflowData.rabStatus.data.forEach(rab => {
        if (rab?.approvedAt) {
          insertActivity({
            type: 'approval',
            title: 'Item RAP disetujui',
            description: rab.description || 'Item budget',
            timestamp: rab.approvedAt,
            icon: CheckCircle,
            color: '#30D158'
          });
        }
      });
    }
    
    // Add PO creations
    if (Array.isArray(workflowData?.purchaseOrders)) {
      workflowData.purchaseOrders.forEach(po => {
        if (po?.createdAt) {
          insertActivity({
            type: 'purchase',
            title: 'Purchase Order dibuat',
            description: `PO: ${po.poNumber || 'N/A'}`,
            timestamp: po.createdAt,
            icon: ShoppingCart,
            color: '#0A84FF'
          });
        }
      });
    }
    
    // Add delivery receipts
    if (Array.isArray(workflowData?.deliveryReceipts)) {
      workflowData.deliveryReceipts.forEach(dr => {
        if (dr?.createdAt) {
          insertActivity({
            type: 'delivery',
            title: 'Material diterima',
            description: `${dr.items?.length || 0} items dari ${dr.supplier || 'supplier'}`,
            timestamp: dr.createdAt,
            icon: Package,
            color: '#BF5AF2'
          });
        }
      });
    }
    
    // Add Berita Acara
    if (Array.isArray(workflowData?.beritaAcara)) {
      workflowData.beritaAcara.forEach(ba => {
        if (ba?.createdAt) {
          insertActivity({
            type: 'document',
            title: 'Berita Acara dibuat',
            description: ba.title || ba.description || 'Dokumen resmi',
            timestamp: ba.createdAt,
            icon: ClipboardCheck,
            color: '#FF9F0A'
          });
        }
      });
    }
    
    // Add project creation
    if (project?.createdAt) {
      insertActivity({
        type: 'creation',
        title: 'Proyek dibuat',
        description: project.projectName || project.name,
        timestamp: project.createdAt,
        icon: FileText,
        color: '#8E8E93'
      });
    }
    
    return topActivities;
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
          <div className="text-center py-8 px-4">
            <Activity className="h-12 w-12 mx-auto text-[#636366] mb-3" />
            <p className="text-white font-medium mb-1">Belum Ada Aktivitas</p>
            <p className="text-sm text-[#8E8E93] leading-relaxed">
              Aktivitas proyek akan muncul di sini
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentActivity;
