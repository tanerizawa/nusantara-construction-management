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
    <div className="rounded-3xl border border-white/5 bg-white/5 shadow-[0_25px_60px_rgba(0,0,0,0.35)]">
      <div className="flex items-center border-b border-white/10 px-5 py-3 text-white">
        <Activity className="mr-2 h-5 w-5 text-[#60a5fa]" />
        <h3 className="text-base font-semibold">Aktivitas Terbaru</h3>
      </div>
      <div className="p-4">
        {activities.length > 0 ? (
          <div className="space-y-3">
            {activities.map((activity, index) => {
              const IconComponent = activity.icon;
              return (
                <div key={index} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-[#05070d] px-4 py-3 transition hover:border-white/30">
                  <div 
                    className="flex h-9 w-9 items-center justify-center rounded-2xl"
                    style={{ backgroundColor: `${activity.color}20` }}
                  >
                    <IconComponent 
                      className="h-4 w-4" 
                      style={{ color: activity.color }} 
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-white line-clamp-1">
                      {activity.title}
                    </p>
                    <p className="text-xs text-white/60 line-clamp-1">
                      {activity.description}
                    </p>
                    <p className="text-xs text-white/40">
                      {formatDate(activity.timestamp)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="px-4 py-8 text-center text-white/60">
            <Activity className="mb-3 h-12 w-12 mx-auto text-white/30" />
            <p className="font-medium text-white">Belum Ada Aktivitas</p>
            <p className="text-sm text-white/60">Aktivitas proyek akan muncul di sini</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentActivity;
