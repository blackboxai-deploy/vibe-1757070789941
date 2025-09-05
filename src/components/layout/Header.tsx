'use client';

import { formatDisplayDate } from '@/lib/dateUtils';
import { useTasks } from '@/hooks/useTasks';

export function Header() {
  const { getStats } = useTasks();
  const stats = getStats();
  const today = new Date();

  return (
    <header className="bg-white shadow-sm border-b px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Everyday Planner</h1>
          <p className="text-sm text-gray-600 mt-1">
            {formatDisplayDate(today)}
          </p>
        </div>
        
        <div className="flex items-center space-x-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.tasksToday}</div>
            <div className="text-xs text-gray-500">Today's Tasks</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{stats.completedTasks}</div>
            <div className="text-xs text-gray-500">Completed</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {Math.round(stats.completionRate)}%
            </div>
            <div className="text-xs text-gray-500">Success Rate</div>
          </div>
        </div>
      </div>
    </header>
  );
}