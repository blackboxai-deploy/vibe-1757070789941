'use client';

import { useEffect, useState } from 'react';
import { DailyView } from '@/components/planner/DailyView';
import { useTasks } from '@/hooks/useTasks';
import { LocalStorageService } from '@/lib/storage';
import { Category } from '@/lib/types';

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const {
    tasks,
    isLoading: tasksLoading,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskComplete,
  } = useTasks();

  useEffect(() => {
    const loadedCategories = LocalStorageService.getCategories();
    setCategories(loadedCategories);
    setIsLoading(false);
  }, []);

  if (isLoading || tasksLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your planner...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <DailyView
        tasks={tasks}
        categories={categories}
        onAddTask={addTask}
        onUpdateTask={updateTask}
        onDeleteTask={deleteTask}
        onToggleComplete={toggleTaskComplete}
      />
    </div>
  );
}