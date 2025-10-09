import React from 'react';
import { Activity } from 'lucide-react';
import { formatDate } from '../utils';

/**
 * Recent Activity Component
 * Displays recent project activities
 */
const RecentActivity = ({ project }) => {
  return (
    <div className="bg-[#2C2C2E] rounded-lg  border border-[#38383A] overflow-hidden">
      <div className="px-4 py-3 bg-[#1C1C1E] border-b border-[#38383A]">
        <h3 className="text-base font-semibold text-white flex items-center">
          <Activity className="h-5 w-5 mr-2 text-[#0A84FF]" />
          Aktivitas Terbaru
        </h3>
      </div>
      <div className="p-4">
        <div className="space-y-4">
          <div className="flex items-start space-x-3 p-3 hover:bg-[#1C1C1E] rounded-lg transition-colors">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white">Proyek dibuat</p>
              <p className="text-xs text-[#98989D] truncate">
                {formatDate(project.createdAt)}
              </p>
            </div>
          </div>
          
          {project.updatedAt && project.updatedAt !== project.createdAt && (
            <div className="flex items-start space-x-3 p-3 hover:bg-[#1C1C1E] rounded-lg transition-colors">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white">Pembaruan terakhir</p>
                <p className="text-xs text-[#98989D] truncate">
                  {formatDate(project.updatedAt)}
                </p>
              </div>
            </div>
          )}
          
          {/* Add more recent activities from database if available */}
          {project.recentActivities?.slice(0, 3).map((activity, index) => (
            <div key={index} className="flex items-start space-x-3 p-3 hover:bg-[#1C1C1E] rounded-lg transition-colors">
              <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                activity.type === 'approval' ? 'bg-yellow-500' :
                activity.type === 'completion' ? 'bg-green-500' :
                activity.type === 'update' ? 'bg-blue-500' :
                'bg-gray-500'
              }`}></div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {activity.description}
                </p>
                <p className="text-xs text-[#98989D]">
                  {formatDate(activity.timestamp)}
                </p>
              </div>
            </div>
          )) || (
            !project.updatedAt || project.updatedAt === project.createdAt ? (
              <div className="text-center py-3">
                <p className="text-sm text-[#98989D]">Tidak ada aktivitas terbaru</p>
              </div>
            ) : null
          )}
        </div>
      </div>
    </div>
  );
};

export default RecentActivity;
