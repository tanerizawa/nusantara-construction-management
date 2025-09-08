import React from 'react';
import { ArrowUpDown, Calendar, Clock, AlertTriangle, CheckCircle, Filter } from 'lucide-react';
import Button from '../ui/Button';

/**
 * Professional Project Sorting Controls
 * Provides sorting options for project management
 */
const ProjectSorting = ({ 
  currentSort = 'created_at',
  currentOrder = 'desc',
  onSortChange,
  className = ''
}) => {
  const sortOptions = [
    {
      value: 'created_at',
      label: 'Terbaru',
      icon: <Calendar className="h-4 w-4" />,
      description: 'Proyek terbaru dibuat'
    },
    {
      value: 'priority',
      label: 'Prioritas',
      icon: <AlertTriangle className="h-4 w-4" />,
      description: 'Tingkat kepentingan'
    },
    {
      value: 'status',
      label: 'Status',
      icon: <CheckCircle className="h-4 w-4" />,
      description: 'Status proyek saat ini'
    },
    {
      value: 'budget',
      label: 'Budget',
      icon: <ArrowUpDown className="h-4 w-4" />,
      description: 'Nilai kontrak'
    },
    {
      value: 'progress',
      label: 'Progress',
      icon: <Clock className="h-4 w-4" />,
      description: 'Persentase kemajuan'
    },
    {
      value: 'name',
      label: 'Nama A-Z',
      icon: <ArrowUpDown className="h-4 w-4" />,
      description: 'Urutan alfabetis'
    },
    {
      value: 'endDate',
      label: 'Deadline',
      icon: <Calendar className="h-4 w-4" />,
      description: 'Tanggal berakhir'
    }
  ];

  const handleSortChange = (sortBy) => {
    let newOrder = 'desc';
    
    // If clicking the same sort, toggle order
    if (currentSort === sortBy) {
      newOrder = currentOrder === 'desc' ? 'asc' : 'desc';
    } else {
      // Default orders for different fields
      if (sortBy === 'name') newOrder = 'asc';
      if (sortBy === 'progress') newOrder = 'asc';
      if (sortBy === 'endDate') newOrder = 'asc';
    }
    
    onSortChange(sortBy, newOrder);
  };

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {sortOptions.map((option) => (
        <Button
          key={option.value}
          variant={currentSort === option.value ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleSortChange(option.value)}
          className={`flex items-center gap-2 transition-all duration-200 ${
            currentSort === option.value 
              ? 'bg-blue-600 text-white shadow-md' 
              : 'hover:bg-gray-50 dark:hover:bg-gray-800'
          }`}
          title={option.description}
        >
          {option.icon}
          <span>{option.label}</span>
          {currentSort === option.value && (
            <ArrowUpDown 
              className={`h-3 w-3 transition-transform duration-200 ${
                currentOrder === 'asc' ? 'rotate-180' : ''
              }`} 
            />
          )}
        </Button>
      ))}
    </div>
  );
};

export default ProjectSorting;
