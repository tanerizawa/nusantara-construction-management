import React from 'react';
import ChartContainer from './ChartContainer';
import { BarChart3 } from 'lucide-react';
import { formatDate } from '../utils/chartUtils';

/**
 * MilestoneChart Component
 * Visualizes project milestones on a timeline
 *
 * @param {object} props - Component props
 * @param {array} props.milestones - Project milestones
 * @param {object} props.projectTimeline - Project start and end dates
 */
const MilestoneChart = ({ milestones = [], projectTimeline = {} }) => {
  const today = new Date();
  const startDate = new Date(projectTimeline.startDate);
  const endDate = new Date(projectTimeline.endDate);
  const totalDays = (endDate - startDate) / (1000 * 60 * 60 * 24);
  
  return (
    <ChartContainer title="Milestone Timeline" height="h-64">
      <div className="p-6">
        {milestones.length > 0 ? (
          <div className="space-y-4">
            {milestones.map((milestone, index) => {
              const milestoneDate = new Date(milestone.dueDate);
              const daysFromStart = (milestoneDate - startDate) / (1000 * 60 * 60 * 24);
              const position = (daysFromStart / totalDays) * 100;
              const isPast = milestoneDate < today;
              const isCompleted = milestone.completed;
              
              return (
                <div key={index} className="relative">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">
                      {milestone.title}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatDate(milestone.dueDate)}
                    </span>
                  </div>
                  
                  {/* Timeline Bar */}
                  <div className="relative w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`absolute h-2 rounded-full ${
                        isCompleted 
                          ? 'bg-green-500' 
                          : isPast 
                          ? 'bg-red-500' 
                          : 'bg-blue-500'
                      }`}
                      style={{ 
                        left: `${Math.max(0, position - 1)}%`,
                        width: '2%'
                      }}
                    ></div>
                  </div>
                  
                  <p className="text-xs text-gray-600 mt-1">
                    {milestone.description}
                  </p>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <BarChart3 size={24} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm">Belum ada milestone</p>
          </div>
        )}
      </div>
    </ChartContainer>
  );
};

export default MilestoneChart;