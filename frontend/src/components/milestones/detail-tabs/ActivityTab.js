// Activity Tab - Activity timeline and log
import React, { useState } from 'react';
import { Activity, Image as ImageIcon, DollarSign, TrendingUp, CheckCircle, XCircle, AlertCircle, MessageSquare, Plus, Download } from 'lucide-react';
import { useMilestoneActivities } from '../hooks/useMilestoneActivities';
import { formatDate } from '../../../utils/formatters';
import { getImageUrl } from '../../../utils/config';

const ActivityTab = ({ milestone, projectId }) => {
  const { activities, loading, hasMore, loadMore, addActivity } = useMilestoneActivities(projectId, milestone.id);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    activityType: 'comment',
    activityTitle: '',
    activityDescription: ''
  });

  // Get activity icon
  const getActivityIcon = (type) => {
    const icons = {
      created: Activity,
      updated: TrendingUp,
      status_change: AlertCircle,
      progress_update: TrendingUp,
      photo_upload: ImageIcon,
      cost_added: DollarSign,
      cost_updated: DollarSign,
      issue_reported: AlertCircle,
      issue_resolved: CheckCircle,
      approved: CheckCircle,
      rejected: XCircle,
      comment: MessageSquare,
      other: Activity
    };
    return icons[type] || Activity;
  };

  // Get activity color
  const getActivityColor = (type) => {
    const colors = {
      created: '#0A84FF',
      updated: '#0A84FF',
      status_change: '#FF9F0A',
      progress_update: '#30D158',
      photo_upload: '#BF5AF2',
      cost_added: '#30D158',
      cost_updated: '#FF9F0A',
      issue_reported: '#FF453A',
      issue_resolved: '#30D158',
      approved: '#30D158',
      rejected: '#FF453A',
      comment: '#8E8E93',
      other: '#636366'
    };
    return colors[type] || '#636366';
  };

  // Format time ago
  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + ' years ago';
    
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + ' months ago';
    
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + ' days ago';
    
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + ' hours ago';
    
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + ' minutes ago';
    
    return 'Just now';
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addActivity(formData);
      setFormData({
        activityType: 'comment',
        activityTitle: '',
        activityDescription: ''
      });
      setShowAddForm(false);
    } catch (error) {
      console.error('Failed to add activity:', error);
      alert('Failed to add activity');
    }
  };

  // Handle download attachment
  const handleDownload = (url, filename = 'attachment') => {
    if (!url) return;
    
    const fullUrl = url.startsWith('http') ? url : getImageUrl(url);
    
    // Create temporary anchor element for download
    const link = document.createElement('a');
    link.href = fullUrl;
    link.download = filename;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Debug: Log activities data */}
      {activities.length > 0 && console.log('[ActivityTab] Activities data:', activities.slice(0, 2))}
      
      {/* Add Activity Button */}
      {!showAddForm && (
        <button
          onClick={() => setShowAddForm(true)}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#0A84FF] hover:bg-[#0A84FF]/90 text-white rounded-lg transition-colors font-medium"
        >
          <Plus size={18} />
          <span>Add Manual Note</span>
        </button>
      )}

      {/* Add Activity Form */}
      {showAddForm && (
        <div className="bg-[#2C2C2E] rounded-lg p-4 border border-[#38383A]">
          <h3 className="font-semibold text-white mb-4">Add Activity Note</h3>
          
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-xs text-[#8E8E93] mb-1">Type</label>
              <select
                value={formData.activityType}
                onChange={(e) => setFormData(prev => ({ ...prev, activityType: e.target.value }))}
                required
                className="w-full px-3 py-2 bg-[#1C1C1E] border border-[#38383A] rounded text-sm text-white focus:border-[#0A84FF] focus:outline-none"
              >
                <option value="comment">Comment</option>
                <option value="issue_reported">Issue Reported</option>
                <option value="issue_resolved">Issue Resolved</option>
                <option value="progress_update">Progress Update</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-[#8E8E93] mb-1">Title *</label>
              <input
                type="text"
                value={formData.activityTitle}
                onChange={(e) => setFormData(prev => ({ ...prev, activityTitle: e.target.value }))}
                required
                placeholder="Brief title..."
                className="w-full px-3 py-2 bg-[#1C1C1E] border border-[#38383A] rounded text-sm text-white placeholder-[#636366] focus:border-[#0A84FF] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs text-[#8E8E93] mb-1">Description *</label>
              <textarea
                value={formData.activityDescription}
                onChange={(e) => setFormData(prev => ({ ...prev, activityDescription: e.target.value }))}
                required
                rows={3}
                placeholder="Detailed description..."
                className="w-full px-3 py-2 bg-[#1C1C1E] border border-[#38383A] rounded text-sm text-white placeholder-[#636366] focus:border-[#0A84FF] focus:outline-none resize-none"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-[#0A84FF] hover:bg-[#0A84FF]/90 text-white rounded-lg transition-colors font-medium"
              >
                Add Note
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 bg-[#48484A] hover:bg-[#48484A]/80 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Activity Timeline */}
      <div className="space-y-4">
        <h3 className="font-semibold text-white">Activity Timeline ({activities.length})</h3>
        
        {loading && activities.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm text-[#8E8E93]">Loading activities...</p>
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center py-8 bg-[#2C2C2E] rounded-lg border border-[#38383A]">
            <Activity size={48} className="text-[#636366] mx-auto mb-3" />
            <p className="text-sm text-[#8E8E93]">No activities yet. Actions will appear here automatically.</p>
          </div>
        ) : (
          <>
            {/* Timeline Container with Scroll */}
            <div className="relative max-h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-[#38383A] scrollbar-track-transparent hover:scrollbar-thumb-[#48484A]">
              {/* Vertical Line */}
              <div className="absolute left-5 top-8 bottom-8 w-px bg-[#38383A]"></div>
              
              <div className="space-y-4">
              {activities.map((activity, index) => {
                const Icon = getActivityIcon(activity.activityType);
                const color = getActivityColor(activity.activityType);
                
                return (
                  <div key={activity.id} className="relative flex gap-4">
                    {/* Icon Circle */}
                    <div 
                      className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center relative z-10"
                      style={{ backgroundColor: `${color}20`, border: `2px solid ${color}` }}
                    >
                      <Icon size={18} style={{ color }} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 bg-[#2C2C2E] rounded-lg p-4 border border-[#38383A]">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className="text-sm font-semibold text-white mb-1">
                            {activity.activityTitle}
                          </h4>
                          <p className="text-xs text-[#8E8E93]">
                            {activity.activityDescription}
                          </p>
                        </div>
                        <span 
                          className="inline-flex px-2 py-0.5 rounded text-xs font-medium capitalize flex-shrink-0 ml-2"
                          style={{ 
                            backgroundColor: `${color}20`,
                            color: color
                          }}
                        >
                          {activity.activityType.replace('_', ' ')}
                        </span>
                      </div>

                      {/* Metadata */}
                      <div className="flex items-center flex-wrap gap-3 text-xs text-[#636366] mt-3 pt-3 border-t border-[#38383A]">
                        <span title={formatDate(activity.performedAt || activity.createdAt)}>
                          {timeAgo(activity.performedAt || activity.createdAt)}
                        </span>
                        {activity.performer_name && (
                          <>
                            <span>•</span>
                            <span>By: {activity.performer_name}</span>
                          </>
                        )}
                        {activity.relatedPhotoId && (
                          <>
                            <span>•</span>
                            {activity.related_photo_url ? (
                              // Photo exists - show download button
                              <button
                                onClick={() => handleDownload(
                                  activity.related_photo_url,
                                  `photo-${activity.relatedPhotoId}.jpg`
                                )}
                                className="flex items-center gap-1 text-[#0A84FF] hover:text-[#0A84FF]/80 transition-colors"
                                title="Download attached photo"
                              >
                                <ImageIcon size={12} />
                                <span>Photo</span>
                                <Download size={12} />
                              </button>
                            ) : (
                              // Photo deleted - show strikethrough indicator
                              <span 
                                className="flex items-center gap-1 text-[#636366] line-through opacity-60"
                                title="Photo has been deleted"
                              >
                                <ImageIcon size={12} />
                                <span>Photo (deleted)</span>
                              </span>
                            )}
                          </>
                        )}
                        {activity.related_cost_id && (
                          <>
                            {console.log(`[ActivityTab] Cost info for ${activity.id}:`, {
                              cost_id: activity.related_cost_id,
                              cost_amount: activity.related_cost_amount,
                              type: typeof activity.related_cost_amount,
                              is_object: typeof activity.related_cost_amount === 'object'
                            })}
                            <span>•</span>
                            {activity.related_cost_amount && typeof activity.related_cost_amount === 'object' ? (
                              activity.related_cost_amount.is_deleted ? (
                                // Cost was deleted - show who deleted it
                                <span 
                                  className="flex items-center gap-1 text-[#636366] line-through opacity-60"
                                  title={`Deleted by ${activity.related_cost_amount.deleted_by_name || 'Unknown'} on ${formatDate(activity.related_cost_amount.deleted_at)}`}
                                >
                                  <DollarSign size={12} />
                                  <span>
                                    Deleted by {activity.related_cost_amount.deleted_by_name || 'Unknown'}
                                  </span>
                                </span>
                              ) : (
                                // Cost exists - show amount and creator
                                <span 
                                  className="flex items-center gap-1"
                                  title={`Created by ${activity.related_cost_amount.recorded_by_name || 'Unknown'}\nCategory: ${activity.related_cost_amount.category || 'N/A'}`}
                                >
                                  <DollarSign size={12} />
                                  <span>
                                    Cost: Rp {Number(activity.related_cost_amount.amount).toLocaleString('id-ID')}
                                  </span>
                                  <span className="text-[#8E8E93] text-[10px]">
                                    by {activity.related_cost_amount.recorded_by_name || 'Unknown'}
                                  </span>
                                </span>
                              )
                            ) : (
                              // Cost not found (legacy data)
                              <span 
                                className="flex items-center gap-1 text-[#636366] opacity-60"
                                title="Cost data not available"
                              >
                                <DollarSign size={12} />
                                <span>Cost data unavailable</span>
                              </span>
                            )}
                          </>
                        )}
                        {activity.metadata?.attachmentUrl && (
                          <>
                            <span>•</span>
                            <button
                              onClick={() => handleDownload(
                                activity.metadata.attachmentUrl,
                                activity.metadata.attachmentName || 'attachment'
                              )}
                              className="flex items-center gap-1 text-[#5AC8FA] hover:text-[#5AC8FA]/80 transition-colors"
                              title="Download attachment"
                            >
                              <Download size={12} />
                              <span>Download</span>
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              </div>
            </div>

            {/* Load More */}
            {hasMore && (
              <button
                onClick={() => loadMore(activities.length)}
                disabled={loading}
                className="w-full px-4 py-2 bg-[#2C2C2E] hover:bg-[#38383A] text-white rounded-lg transition-colors text-sm font-medium border border-[#38383A]"
              >
                {loading ? 'Loading...' : 'Load More'}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ActivityTab;
