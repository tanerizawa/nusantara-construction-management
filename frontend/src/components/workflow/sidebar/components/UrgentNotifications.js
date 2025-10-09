import React from 'react';
import { AlertTriangle } from 'lucide-react';

/**
 * Menampilkan urgent notifications kompak
 */
export const UrgentNotifications = ({ notifications }) => {
  if (!notifications || notifications.length === 0) {
    return null;
  }

  return (
    <div className="mt-2 bg-[#FF3B30]/10 border border-[#FF3B30]/30 rounded-lg p-2">
      <div className="flex items-center">
        <AlertTriangle className="h-4 w-4 text-[#FF3B30] mr-2" />
        <span className="text-xs text-[#FF3B30] font-medium">
          {notifications.length} urgent item(s)
        </span>
      </div>
    </div>
  );
};
