'use client';

import { useMemo } from 'react';
import { Task, Category } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface ProgressStatsProps {
  total: number;
  completed: number;
  categories: Category[];
  tasks: Task[];
}

export function ProgressStats({ total, completed, categories, tasks }: ProgressStatsProps) {
  const completionRate = total > 0 ? (completed / total) * 100 : 0;
  
  const priorityStats = useMemo(() => {
    const stats = {
      high: { total: 0, completed: 0 },
      medium: { total: 0, completed: 0 },
      low: { total: 0, completed: 0 },
    };

    tasks.forEach(task => {
      stats[task.priority].total++;
      if (task.completed) {
        stats[task.priority].completed++;
      }
    });

    return stats;
  }, [tasks]);

  const categoryStats = useMemo(() => {
    const stats: Record<string, { total: number; completed: number; color: string; name: string }> = {};

    categories.forEach(category => {
      stats[category.id] = {
        total: 0,
        completed: 0,
        color: category.color,
        name: category.name,
      };
    });

    tasks.forEach(task => {
      if (stats[task.category]) {
        stats[task.category].total++;
        if (task.completed) {
          stats[task.category].completed++;
        }
      }
    });

    return Object.values(stats).filter(stat => stat.total > 0);
  }, [tasks, categories]);

  if (total === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-gray-500">
            <div className="text-2xl mb-2">📊</div>
            <p className="text-sm">No tasks for today</p>
            <p className="text-xs text-gray-400">Add your first task to see progress stats</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Overall Progress */}
      <Card>
        <CardContent className="p-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Overall Progress</span>
              <span className="text-lg font-bold text-blue-600">
                {Math.round(completionRate)}%
              </span>
            </div>
            <Progress value={completionRate} className="h-3" />
            <div className="flex justify-between text-xs text-gray-500">
              <span>{completed} completed</span>
              <span>{total - completed} remaining</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Priority Breakdown */}
      <Card>
        <CardContent className="p-4">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Priority Breakdown</h3>
          <div className="space-y-2">
            {(Object.entries(priorityStats) as Array<[string, { total: number; completed: number }]>).map(([priority, stats]) => {
              if (stats.total === 0) return null;
              const rate = (stats.completed / stats.total) * 100;
              const colors = {
                high: 'text-red-600',
                medium: 'text-yellow-600',
                low: 'text-green-600',
              };
              
              return (
                <div key={priority} className="flex items-center justify-between text-xs">
                  <span className="capitalize">{priority}</span>
                  <div className="flex items-center space-x-2">
                    <span className={colors[priority as keyof typeof colors]}>
                      {stats.completed}/{stats.total}
                    </span>
                    <span className="text-gray-400">({Math.round(rate)}%)</span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Category Breakdown */}
      <Card>
        <CardContent className="p-4">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Category Breakdown</h3>
          <div className="space-y-2">
            {categoryStats.slice(0, 4).map((stat) => {
              const rate = (stat.completed / stat.total) * 100;
              
              return (
                <div key={stat.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: stat.color }}
                    />
                    <span className="truncate">{stat.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span style={{ color: stat.color }}>
                      {stat.completed}/{stat.total}
                    </span>
                    <span className="text-gray-400">({Math.round(rate)}%)</span>
                  </div>
                </div>
              );
            })}
            
            {categoryStats.length > 4 && (
              <div className="text-xs text-gray-400 text-center pt-1">
                +{categoryStats.length - 4} more categories
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}