'use client';

import { useState, useMemo } from 'react';
import { Task, Category } from '@/lib/types';
import { formatDate, formatDisplayDate, getNextDay, getPreviousDay } from '@/lib/dateUtils';
import { TaskCard } from './TaskCard';
import { TaskForm } from './TaskForm';
import { ProgressStats } from './ProgressStats';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

interface DailyViewProps {
  tasks: Task[];
  categories: Category[];
  onAddTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
  onDeleteTask: (id: string) => void;
  onToggleComplete: (id: string) => void;
}

export function DailyView({
  tasks,
  categories,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  onToggleComplete,
}: DailyViewProps) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const selectedDateStr = formatDate(selectedDate);
  
  const dayTasks = useMemo(() => {
    return tasks
      .filter(task => task.date === selectedDateStr)
      .sort((a, b) => {
        // Sort by completion status first (incomplete first)
        if (a.completed !== b.completed) {
          return a.completed ? 1 : -1;
        }
        // Then by priority (high -> medium -> low)
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        if (a.priority !== b.priority) {
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        }
        // Finally by time slot if available
        if (a.timeSlot && b.timeSlot) {
          return a.timeSlot.localeCompare(b.timeSlot);
        }
        if (a.timeSlot) return -1;
        if (b.timeSlot) return 1;
        return 0;
      });
  }, [tasks, selectedDateStr]);

  const completedTasks = dayTasks.filter(task => task.completed);
  const incompleteTasks = dayTasks.filter(task => !task.completed);

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsTaskFormOpen(true);
  };

  const handleSubmitTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingTask) {
      onUpdateTask(editingTask.id, taskData);
    } else {
      onAddTask({
        ...taskData,
        date: selectedDateStr,
      });
    }
    setEditingTask(null);
  };

  const handleCloseForm = () => {
    setIsTaskFormOpen(false);
    setEditingTask(null);
  };

  const goToPreviousDay = () => {
    setSelectedDate(getPreviousDay(selectedDate));
  };

  const goToNextDay = () => {
    setSelectedDate(getNextDay(selectedDate));
  };

  const goToToday = () => {
    setSelectedDate(new Date());
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Date Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" onClick={goToPreviousDay}>
            ← Previous
          </Button>
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900">
              {formatDisplayDate(selectedDate)}
            </h2>
            <p className="text-sm text-gray-500">
              {dayTasks.length} task{dayTasks.length !== 1 ? 's' : ''} planned
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={goToNextDay}>
            Next →
          </Button>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={goToToday}>
            Today
          </Button>
          <Button onClick={() => setIsTaskFormOpen(true)}>
            + Add Task
          </Button>
        </div>
      </div>

      {/* Progress Stats */}
      <ProgressStats
        total={dayTasks.length}
        completed={completedTasks.length}
        categories={categories}
        tasks={dayTasks}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Incomplete Tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Pending Tasks ({incompleteTasks.length})</span>
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-96">
              {incompleteTasks.length > 0 ? (
                <div className="space-y-3">
                  {incompleteTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      categories={categories}
                      onToggleComplete={onToggleComplete}
                      onEdit={handleEditTask}
                      onDelete={onDeleteTask}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-32 text-gray-500">
                  <div className="text-4xl mb-2">🎉</div>
                  <p className="text-sm">No pending tasks!</p>
                  <p className="text-xs text-gray-400">Add a new task to get started</p>
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Completed Tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Completed Tasks ({completedTasks.length})</span>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-96">
              {completedTasks.length > 0 ? (
                <div className="space-y-3">
                  {completedTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      categories={categories}
                      onToggleComplete={onToggleComplete}
                      onEdit={handleEditTask}
                      onDelete={onDeleteTask}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-32 text-gray-500">
                  <div className="text-4xl mb-2">📝</div>
                  <p className="text-sm">No completed tasks yet</p>
                  <p className="text-xs text-gray-400">Complete tasks to see them here</p>
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Task Form Modal */}
      <TaskForm
        isOpen={isTaskFormOpen}
        onClose={handleCloseForm}
        onSubmit={handleSubmitTask}
        editingTask={editingTask}
        categories={categories}
        selectedDate={selectedDate}
      />
    </div>
  );
}