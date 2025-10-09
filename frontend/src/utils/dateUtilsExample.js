/**
 * Example Usage of Date Utils with WIB Timezone
 * 
 * Import and use these utilities in your components to display
 * dates and times in WIB (Waktu Indonesia Barat / UTC+7)
 */

import React from 'react';
import {
  formatDate,
  formatTime,
  formatDateTime,
  formatRelativeTime,
  formatDateTimeShort,
  getCurrentWIB,
  TIMEZONE
} from '../utils/dateUtils';

const DateUtilsExample = () => {
  // Example date
  const sampleDate = new Date('2025-10-09T14:30:00Z'); // UTC time
  const now = getCurrentWIB();

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-bold mb-4">Date Utils - WIB Timezone Examples</h2>
      
      <div className="bg-blue-50 p-4 rounded">
        <p className="font-semibold">Timezone: {TIMEZONE}</p>
        <p>Current WIB Time: {formatDateTime(now, 'full', true)}</p>
      </div>

      <div className="space-y-2">
        <h3 className="font-semibold text-lg">Date Formatting:</h3>
        <p><strong>Short:</strong> {formatDate(sampleDate, 'short')}</p>
        <p><strong>Medium:</strong> {formatDate(sampleDate, 'medium')}</p>
        <p><strong>Long:</strong> {formatDate(sampleDate, 'long')}</p>
        <p><strong>Full:</strong> {formatDate(sampleDate, 'full')}</p>
      </div>

      <div className="space-y-2">
        <h3 className="font-semibold text-lg">Time Formatting:</h3>
        <p><strong>Without seconds:</strong> {formatTime(sampleDate)}</p>
        <p><strong>With seconds:</strong> {formatTime(sampleDate, true)}</p>
      </div>

      <div className="space-y-2">
        <h3 className="font-semibold text-lg">DateTime Formatting:</h3>
        <p><strong>Short:</strong> {formatDateTimeShort(sampleDate)}</p>
        <p><strong>Medium:</strong> {formatDateTime(sampleDate, 'medium')}</p>
        <p><strong>Long:</strong> {formatDateTime(sampleDate, 'long', true)}</p>
      </div>

      <div className="space-y-2">
        <h3 className="font-semibold text-lg">Relative Time:</h3>
        <p><strong>1 hour ago:</strong> {formatRelativeTime(new Date(Date.now() - 3600000))}</p>
        <p><strong>2 days ago:</strong> {formatRelativeTime(new Date(Date.now() - 172800000))}</p>
      </div>
    </div>
  );
};

export default DateUtilsExample;

/**
 * Usage Examples in Components:
 */

// Example 1: Display creation date
export const ProjectCard = ({ project }) => (
  <div>
    <h3>{project.name}</h3>
    <p>Dibuat: {formatDateTime(project.createdAt)}</p>
    <p>Update terakhir: {formatRelativeTime(project.updatedAt)}</p>
  </div>
);

// Example 2: Table with dates
export const ProjectsTable = ({ projects }) => (
  <table>
    <thead>
      <tr>
        <th>Nama</th>
        <th>Tanggal Mulai</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      {projects.map(project => (
        <tr key={project.id}>
          <td>{project.name}</td>
          <td>{formatDate(project.startDate, 'long')}</td>
          <td>{project.status}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

// Example 3: Date input field
export const DateInput = ({ value, onChange }) => (
  <input
    type="date"
    value={formatDateInput(value)}
    onChange={(e) => onChange(parseDateWIB(e.target.value))}
  />
);

// Example 4: Activity log with relative time
export const ActivityLog = ({ activities }) => (
  <div>
    {activities.map(activity => (
      <div key={activity.id} className="flex justify-between">
        <span>{activity.message}</span>
        <span className="text-gray-500">
          {formatRelativeTime(activity.timestamp)}
        </span>
      </div>
    ))}
  </div>
);

// Example 5: Purchase Order with date/time
export const PODetails = ({ po }) => (
  <div>
    <h3>PO: {po.poNumber}</h3>
    <p>Order Date: {formatDate(po.orderDate, 'long')}</p>
    <p>Expected Delivery: {formatDate(po.expectedDeliveryDate, 'long')}</p>
    <p>Created: {formatDateTimeShort(po.createdAt)}</p>
    <p className="text-sm text-gray-500">
      {formatRelativeTime(po.createdAt)}
    </p>
  </div>
);

/**
 * Important Notes:
 * 
 * 1. All date/time displays will automatically use WIB timezone
 * 2. Database timestamps are stored with timezone (timestamp with time zone)
 * 3. Backend Sequelize is configured with timezone: '+07:00'
 * 4. Frontend date utils handle timezone conversion automatically
 * 5. Always use these utilities instead of native Date methods for consistency
 */
