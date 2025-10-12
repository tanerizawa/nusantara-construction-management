/**
 * Export Utilities for Projects
 * Handles Excel and PDF export functionality
 */

/**
 * Export projects to Excel format
 * Uses CSV format for broad compatibility
 */
export const exportToExcel = (projects) => {
  if (!projects || projects.length === 0) {
    throw new Error('Tidak ada proyek untuk di-export');
  }

  // CSV Header
  const headers = [
    'Kode Proyek',
    'Nama Proyek',
    'Klien',
    'Lokasi',
    'Budget (IDR)',
    'Progress (%)',
    'Status',
    'Prioritas',
    'Tanggal Mulai',
    'Tanggal Selesai',
    'Dibuat Tanggal'
  ];

  // Convert projects to CSV rows
  const rows = projects.map(project => [
    project.projectCode || project.id,
    project.name || '',
    project.clientName || project.client?.name || project.client || '',
    formatLocation(project.location),
    project.budget || 0,
    project.progress || 0,
    formatStatus(project.status),
    formatPriority(project.priority),
    formatDate(project.startDate),
    formatDate(project.endDate),
    formatDate(project.createdAt)
  ]);

  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  // Add BOM for Excel UTF-8 support
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
  
  // Trigger download
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `proyek-${getTimestamp()}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Export projects to PDF format
 * Uses simple HTML to PDF conversion
 */
export const exportToPDF = (projects) => {
  if (!projects || projects.length === 0) {
    throw new Error('Tidak ada proyek untuk di-export');
  }

  // Create HTML content
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Daftar Proyek - ${getTimestamp()}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 20px;
          color: #333;
        }
        h1 {
          color: #0A84FF;
          border-bottom: 2px solid #0A84FF;
          padding-bottom: 10px;
        }
        .meta {
          color: #666;
          margin-bottom: 20px;
          font-size: 14px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }
        th {
          background-color: #0A84FF;
          color: white;
          padding: 12px;
          text-align: left;
          font-weight: bold;
        }
        td {
          padding: 10px 12px;
          border-bottom: 1px solid #ddd;
        }
        tr:nth-child(even) {
          background-color: #f9f9f9;
        }
        tr:hover {
          background-color: #f0f0f0;
        }
        .status {
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: bold;
        }
        .status-active { background-color: #d4edff; color: #0A84FF; }
        .status-completed { background-color: #d4f4dd; color: #30D158; }
        .status-on-hold { background-color: #fff4d4; color: #FF9F0A; }
        .status-cancelled { background-color: #ffd4d4; color: #FF3B30; }
        .footer {
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #ddd;
          color: #666;
          font-size: 12px;
        }
      </style>
    </head>
    <body>
      <h1>📊 Daftar Proyek Konstruksi</h1>
      <div class="meta">
        <strong>Tanggal Export:</strong> ${new Date().toLocaleString('id-ID')}<br>
        <strong>Total Proyek:</strong> ${projects.length}<br>
        <strong>Total Budget:</strong> ${formatCurrency(projects.reduce((sum, p) => sum + (parseFloat(p.budget) || 0), 0))}
      </div>
      
      <table>
        <thead>
          <tr>
            <th>No</th>
            <th>Kode</th>
            <th>Nama Proyek</th>
            <th>Klien</th>
            <th>Budget</th>
            <th>Progress</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${projects.map((project, index) => `
            <tr>
              <td>${index + 1}</td>
              <td><strong>${project.projectCode || project.id}</strong></td>
              <td>${project.name || ''}</td>
              <td>${project.clientName || project.client?.name || project.client || '-'}</td>
              <td>${formatCurrency(project.budget || 0)}</td>
              <td>${project.progress || 0}%</td>
              <td>
                <span class="status status-${project.status || 'active'}">
                  ${formatStatus(project.status)}
                </span>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      
      <div class="footer">
        <strong>Nusantara Construction Management System</strong><br>
        Generated by: ${localStorage.getItem('userName') || 'System'}<br>
        Document ID: EXP-${Date.now()}
      </div>
    </body>
    </html>
  `;

  // Open print dialog
  const printWindow = window.open('', '_blank');
  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.focus();
  
  // Auto-trigger print after content loads
  printWindow.onload = () => {
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };
};

/**
 * Helper: Format location
 */
const formatLocation = (location) => {
  if (!location) return '-';
  if (typeof location === 'string') return location;
  if (typeof location === 'object') {
    const parts = [];
    if (location.city) parts.push(location.city);
    if (location.province) parts.push(location.province);
    return parts.length > 0 ? parts.join(', ') : '-';
  }
  return '-';
};

/**
 * Helper: Format status
 */
const formatStatus = (status) => {
  const statusMap = {
    'active': 'Aktif',
    'completed': 'Selesai',
    'on-hold': 'Ditunda',
    'cancelled': 'Dibatalkan',
    'planning': 'Perencanaan',
    'archived': 'Diarsipkan'
  };
  return statusMap[status] || status || 'Aktif';
};

/**
 * Helper: Format priority
 */
const formatPriority = (priority) => {
  const priorityMap = {
    'high': 'Tinggi',
    'medium': 'Sedang',
    'low': 'Rendah'
  };
  return priorityMap[priority] || priority || 'Sedang';
};

/**
 * Helper: Format date
 */
const formatDate = (date) => {
  if (!date) return '-';
  try {
    return new Date(date).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  } catch {
    return '-';
  }
};

/**
 * Helper: Format currency
 */
const formatCurrency = (amount) => {
  if (!amount) return 'Rp 0';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

/**
 * Helper: Get timestamp for filename
 */
const getTimestamp = () => {
  const now = new Date();
  return `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}`;
};
