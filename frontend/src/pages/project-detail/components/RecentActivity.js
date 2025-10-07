import React from 'react';
import { Activity } from 'lucide-react';
import { formatDate } from '../utils';

/**
 * Recent Activity Component
 * Displays recent project activities
 */
const RecentActivity = ({ project }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Activity className="h-5 w-5 mr-2 text-blue-600" />
          Aktivitas Terbaru
        </h3>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          <div className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">Proyek dibuat</p>
              <p className="text-xs text-gray-500 truncate">
                {formatDate(project.createdAt)}
              </p>
            </div>
          </div>
          
          {project.updatedAt && project.updatedAt !== project.createdAt && (
            <div className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">Pembaruan terakhir</p>
                <p className="text-xs text-gray-500 truncate">
                  {formatDate(project.updatedAt)}
                </p>
              </div>
            </div>
          )}
          
          {/* Add more recent activities from database if available */}
          {project.recentActivities?.slice(0, 3).map((activity, index) => (
            <div key={index} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                activity.type === 'approval' ? 'bg-yellow-500' :
                activity.type === 'completion' ? 'bg-green-500' :
                activity.type === 'update' ? 'bg-blue-500' :
                'bg-gray-500'
              }`}></div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {activity.description}
                </p>
                <p className="text-xs text-gray-500">
                  {formatDate(activity.timestamp)}
                </p>
              </div>
            </div>
          )) || (
            !project.updatedAt || project.updatedAt === project.createdAt ? (
              <div className="text-center py-4">
                <p className="text-sm text-gray-500">Tidak ada aktivitas terbaru</p>
              </div>
            ) : null
          )}
        </div>
      </div>
    </div>
  );
};

export default RecentActivity;
