'use client';

import { useEffect, useState } from 'react';
import { WeeklyView } from '@/components/planner/WeeklyView';
import { TaskForm } from '@/components/planner/TaskForm';
import { useTasks } from '@/hooks/useTasks';
import { LocalStorageService } from '@/lib/storage';
import { Category, Task } from '@/lib/types';

export default function WeeklyPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  
  const {
    tasks,
    isLoading: tasksLoading,
    updateTask,
    deleteTask,
    toggleTaskComplete,
  } = useTasks();

  useEffect(() => {
    const loadedCategories = LocalStorageService.getCategories();
    setCategories(loadedCategories);
    setIsLoading(false);
  }, []);

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsTaskFormOpen(true);
  };

  const handleSubmitTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingTask) {
      updateTask(editingTask.id, taskData);
    }
    setEditingTask(null);
    setIsTaskFormOpen(false);
  };

  const handleCloseForm = () => {
    setIsTaskFormOpen(false);
    setEditingTask(null);
  };

  if (isLoading || tasksLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading weekly view...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <WeeklyView
        tasks={tasks}
        categories={categories}
        onToggleComplete={toggleTaskComplete}
        onEditTask={handleEditTask}
        onDeleteTask={deleteTask}
      />
      
      {/* Task Form Modal */}
      <TaskForm
        isOpen={isTaskFormOpen}
        onClose={handleCloseForm}
        onSubmit={handleSubmitTask}
        editingTask={editingTask}
        categories={categories}
      />
    </div>
  );
}