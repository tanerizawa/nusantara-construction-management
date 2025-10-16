import React from 'react';
import ChartContainer from './ChartContainer';
import { formatPercentage } from '../utils/chartUtils';

/**
 * ProgressBudgetChart Component
 * Compares progress vs budget usage
 *
 * @param {object} props - Component props
 * @param {number} props.progress - Project progress percentage
 * @param {number} props.budgetUsed - Budget used
 * @param {number} props.contractValue - Contract value
 * @param {object} props.timeline - Project timeline
 */
const ProgressBudgetChart = ({
  progress = 0,
  budgetUsed = 0,
  contractValue = 0,
  timeline = {}
}) => {
  const budgetPercentage = contractValue > 0 ? (budgetUsed / contractValue) * 100 : 0;
  const isOnTrack = Math.abs(progress - budgetPercentage) <= 10;
  
  return (
    <ChartContainer
      title="Progress vs Budget"
      subtitle="Perbandingan kemajuan proyek dengan penggunaan anggaran"
      height="h-72"
    >
      <div className="p-6">
        <div className="grid grid-cols-2 gap-6">
          {/* Progress Circle */}
          <div className="text-center">
            <div className="relative w-24 h-24 mx-auto mb-3">
              <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-gray-200"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-blue-500"
                  strokeLinecap="round"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                  strokeDasharray={`${progress}, 100`}
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                <span className="text-lg font-medium">{formatPercentage(progress)}</span>
              </div>
            </div>
            <h4 className="text-sm font-medium text-gray-900">Physical Progress</h4>
          </div>
          
          {/* Budget Circle */}
          <div className="text-center">
            <div className="relative w-24 h-24 mx-auto mb-3">
              <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-gray-200"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-green-500"
                  strokeLinecap="round"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                  strokeDasharray={`${budgetPercentage}, 100`}
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                <span className="text-lg font-medium">{formatPercentage(budgetPercentage)}</span>
              </div>
            </div>
            <h4 className="text-sm font-medium text-gray-900">Budget Used</h4>
          </div>
        </div>
        
        {/* Status Indicator */}
        <div className={`mt-6 p-3 rounded-lg border ${
          isOnTrack 
            ? 'bg-green-50 border-green-200' 
            : 'bg-yellow-50 border-yellow-200'
        }`}>
          <p className={`text-sm font-medium ${
            isOnTrack ? 'text-green-800' : 'text-yellow-800'
          }`}>
            {isOnTrack 
              ? 'Project is on track with budget and progress aligned.'
              : progress > budgetPercentage
                ? 'Project progress is ahead of budget usage.'
                : 'Budget usage is outpacing project progress.'}
          </p>
        </div>
      </div>
    </ChartContainer>
  );
};

export default ProgressBudgetChart;