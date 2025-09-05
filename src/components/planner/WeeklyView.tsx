'use client';

import { useMemo, useState } from 'react';
import { Task, Category } from '@/lib/types';
import { 
  getWeekDates, 
  getWeekRange, 
  formatDate, 
  getShortDayName,
  isDateToday
} from '@/lib/dateUtils';
import { TaskCard } from './TaskCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

interface WeeklyViewProps {
  tasks: Task[];
  categories: Category[];
  onToggleComplete: (id: string) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
}

export function WeeklyView({
  tasks,
  categories,
  onToggleComplete,
  onEditTask,
  onDeleteTask,
}: WeeklyViewProps) {
  const [selectedWeek, setSelectedWeek] = useState(new Date());
  
  const weekDates = getWeekDates(selectedWeek);
  const weekRange = getWeekRange(selectedWeek);
  
  const weeklyTasks = useMemo(() => {
    const weekTasks: Record<string, Task[]> = {};
    
    weekDates.forEach(date => {
      const dateStr = formatDate(date);
      weekTasks[dateStr] = tasks
        .filter(task => task.date === dateStr)
        .sort((a, b) => {
          if (a.completed !== b.completed) {
            return a.completed ? 1 : -1;
          }
          const priorityOrder = { high: 0, medium: 1, low: 2 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        });
    });
    
    return weekTasks;
  }, [tasks, weekDates]);

  const weekStats = useMemo(() => {
    const allWeekTasks = Object.values(weeklyTasks).reduce((acc, tasks) => acc.concat(tasks), []);
    const completed = allWeekTasks.filter(task => task.completed).length;
    const total = allWeekTasks.length;
    
    return {
      total,
      completed,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  }, [weeklyTasks]);

  const goToPreviousWeek = () => {
    const newDate = new Date(selectedWeek);
    newDate.setDate(selectedWeek.getDate() - 7);
    setSelectedWeek(newDate);
  };

  const goToNextWeek = () => {
    const newDate = new Date(selectedWeek);
    newDate.setDate(selectedWeek.getDate() + 7);
    setSelectedWeek(newDate);
  };

  const goToCurrentWeek = () => {
    setSelectedWeek(new Date());
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Week Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" onClick={goToPreviousWeek}>
            ← Previous Week
          </Button>
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900">
              {weekRange.label}
            </h2>
            <p className="text-sm text-gray-500">
              {weekStats.total} task{weekStats.total !== 1 ? 's' : ''} this week • {weekStats.completed} completed
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={goToNextWeek}>
            Next Week →
          </Button>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={goToCurrentWeek}>
            This Week
          </Button>
          <Badge variant={weekStats.completionRate >= 80 ? "default" : "secondary"}>
            {weekStats.completionRate}% Complete
          </Badge>
        </div>
      </div>

      {/* Week Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-4">
        {weekDates.map((date) => {
          const dateStr = formatDate(date);
          const dayTasks = weeklyTasks[dateStr] || [];
          const completedCount = dayTasks.filter(task => task.completed).length;
          const isToday = isDateToday(date);
          
          return (
            <Card 
              key={dateStr}
              className={`${isToday ? 'ring-2 ring-blue-500 bg-blue-50' : ''}`}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className={`font-semibold ${isToday ? 'text-blue-700' : 'text-gray-900'}`}>
                      {getShortDayName(date)}
                    </span>
                    <span className={`text-lg ${isToday ? 'text-blue-600' : 'text-gray-600'}`}>
                      {date.getDate()}
                    </span>
                  </div>
                  <div className="flex flex-col items-end text-xs">
                    <span className="text-gray-500">
                      {dayTasks.length} task{dayTasks.length !== 1 ? 's' : ''}
                    </span>
                    {dayTasks.length > 0 && (
                      <span className={`font-medium ${completedCount === dayTasks.length ? 'text-green-600' : 'text-gray-600'}`}>
                        {completedCount}/{dayTasks.length} done
                      </span>
                    )}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <ScrollArea className="h-64">
                  {dayTasks.length > 0 ? (
                    <div className="space-y-2">
                      {dayTasks.map((task) => (
                        <TaskCard
                          key={task.id}
                          task={task}
                          categories={categories}
                          onToggleComplete={onToggleComplete}
                          onEdit={onEditTask}
                          onDelete={onDeleteTask}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-20 text-gray-400">
                      <div className="text-2xl mb-1">📝</div>
                      <p className="text-xs text-center">No tasks planned</p>
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Week Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Week Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{weekStats.total}</div>
              <div className="text-sm text-gray-500">Total Tasks</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{weekStats.completed}</div>
              <div className="text-sm text-gray-500">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{weekStats.total - weekStats.completed}</div>
              <div className="text-sm text-gray-500">Remaining</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{weekStats.completionRate}%</div>
              <div className="text-sm text-gray-500">Success Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}