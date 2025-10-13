import React from 'react';
import { Target, AlertTriangle, Clock, CheckCircle, Calendar, PlayCircle } from 'lucide-react';

/**
 * Compact Project Categories Component
 * Integrated info display with category selection
 */
const ProjectCategories = ({ 
  projects = [],
  onCategorySelect,
  selectedCategory = 'all'
}) => {
  // Calculate project statistics efficiently using project management best practices
  const getProjectStats = () => {
    const now = new Date();
    const oneWeek = 7 * 24 * 60 * 60 * 1000;
    const oneMonth = 30 * 24 * 60 * 60 * 1000;
    
    return {
      total: projects.length,
      critical: projects.filter(project => {
        // Advanced critical project detection based on project management best practices
        let criticalScore = 0;
        
        // High priority projects get base score
        if (project.priority === 'high') {
          criticalScore += 3;
        }
        
        // Active projects (in progress) are more critical
        if (project.status === 'active') {
          criticalScore += 2;
        }
        
        // Projects with upcoming deadlines (within 6 months) are critical
        if (project.endDate) {
          const endDate = new Date(project.endDate);
          const daysToDeadline = Math.floor((endDate - now) / (24 * 60 * 60 * 1000));
          
          if (daysToDeadline <= 0) {
            // Overdue projects are extremely critical
            criticalScore += 5;
          } else if (daysToDeadline <= 180) {
            // Projects within 6 months are critical
            criticalScore += 2;
          }
        }
        
        // A project is critical if score >= 5 (combination of factors)
        return criticalScore >= 5;
      }).length,
      recent: projects.filter(p => {
        const createdDate = new Date(p.createdAt);
        return (now - createdDate) <= oneWeek;
      }).length,
      nearDeadline: projects.filter(p => {
        if (!p.endDate) return false;
        const endDate = new Date(p.endDate);
        return (endDate - now) <= oneMonth && endDate > now;
      }).length,
      inProgress: projects.filter(p => p.status === 'active').length,
      completed: projects.filter(p => p.status === 'completed').length,
      planning: projects.filter(p => p.status === 'planning').length
    };
  };

  const stats = getProjectStats();

  const categories = [
    {
      id: 'all',
      label: `Semua (${stats.total})`,
      icon: <Target className="h-4 w-4" />,
      color: 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300',
      hoverColor: 'hover:bg-blue-100 dark:hover:bg-blue-900/30',
      isTotal: true
    },
    {
      id: 'critical',
      label: 'Kritis',
      count: stats.critical,
      icon: <AlertTriangle className="h-4 w-4" />,
      color: 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300',
      hoverColor: 'hover:bg-red-100 dark:hover:bg-red-900/30'
    },
    {
      id: 'recent',
      label: 'Terbaru',
      count: stats.recent,
      icon: <Calendar className="h-4 w-4" />,
      color: 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300',
      hoverColor: 'hover:bg-green-100 dark:hover:bg-green-900/30'
    },
    {
      id: 'deadline',
      label: 'Deadline Dekat',
      count: stats.nearDeadline,
      icon: <Clock className="h-4 w-4" />,
      color: 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300',
      hoverColor: 'hover:bg-amber-100 dark:hover:bg-amber-900/30'
    },
    {
      id: 'active',
      label: 'Aktif / Berjalan',
      count: stats.inProgress,
      icon: <PlayCircle className="h-4 w-4" />,
      color: 'bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300',
      hoverColor: 'hover:bg-purple-100 dark:hover:bg-purple-900/30'
    },
    {
      id: 'completed',
      label: 'Selesai',
      count: stats.completed,
      icon: <CheckCircle className="h-4 w-4" />,
      color: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300',
      hoverColor: 'hover:bg-emerald-100 dark:hover:bg-emerald-900/30'
    }
  ];

  // Filter out categories with zero count (except 'all')
  const visibleCategories = categories.filter(cat => 
    cat.id === 'all' || (cat.count !== undefined && cat.count > 0)
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
      <div className="flex flex-wrap gap-2">
        {visibleCategories.map((category) => {
          const isActive = selectedCategory === category.id;
          const hasCount = category.count !== undefined;
          
          return (
            <button
              key={category.id}
              onClick={() => onCategorySelect(category.id)}
              className={`
                flex items-center gap-2 px-3 py-2 rounded-lg border transition-all duration-200 text-sm font-medium
                ${isActive 
                  ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 shadow-sm' 
                  : `border-gray-200 dark:border-gray-700 ${category.color} ${category.hoverColor}`
                }
                ${category.isTotal ? 'ring-2 ring-blue-200 dark:ring-blue-800' : ''}
              `}
            >
              <div className={`flex items-center justify-center ${isActive ? 'text-blue-600 dark:text-blue-400' : ''}`}>
                {category.icon}
              </div>
              
              <span>{category.label}</span>
              
              {hasCount && category.count > 0 && (
                <span className={`
                  px-1.5 py-0.5 rounded text-xs font-semibold
                  ${isActive 
                    ? 'bg-blue-200 text-blue-800 dark:bg-blue-800 dark:text-blue-200' 
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                  }
                `}>
                  {category.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ProjectCategories;
