'use client';

import { useState, useEffect, useCallback } from 'react';
import { Task, PlannerStats } from '@/lib/types';
import { LocalStorageService } from '@/lib/storage';
import { formatDate } from '@/lib/dateUtils';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadedTasks = LocalStorageService.getTasks();
    setTasks(loadedTasks);
    setIsLoading(false);
  }, []);

  const saveTasks = useCallback((newTasks: Task[]) => {
    setTasks(newTasks);
    LocalStorageService.saveTasks(newTasks);
  }, []);

  const addTask = useCallback((taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    const updatedTasks = [...tasks, newTask];
    saveTasks(updatedTasks);
  }, [tasks, saveTasks]);

  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    const updatedTasks = tasks.map(task =>
      task.id === id
        ? { ...task, ...updates, updatedAt: new Date() }
        : task
    );
    saveTasks(updatedTasks);
  }, [tasks, saveTasks]);

  const deleteTask = useCallback((id: string) => {
    const updatedTasks = tasks.filter(task => task.id !== id);
    saveTasks(updatedTasks);
  }, [tasks, saveTasks]);

  const toggleTaskComplete = useCallback((id: string) => {
    updateTask(id, { completed: !tasks.find(t => t.id === id)?.completed });
  }, [tasks, updateTask]);

  const getTasksByDate = useCallback((date: Date) => {
    const dateStr = formatDate(date);
    return tasks.filter(task => task.date === dateStr);
  }, [tasks]);

  const getTasksByWeek = useCallback((startDate: Date, endDate: Date) => {
    const startStr = formatDate(startDate);
    const endStr = formatDate(endDate);
    return tasks.filter(task => task.date >= startStr && task.date <= endStr);
  }, [tasks]);

  const getStats = useCallback((): PlannerStats => {
    const today = new Date();
    const todayStr = formatDate(today);
    const thisWeekStart = new Date(today);
    thisWeekStart.setDate(today.getDate() - today.getDay() + 1); // Monday
    const thisWeekEnd = new Date(thisWeekStart);
    thisWeekEnd.setDate(thisWeekStart.getDate() + 6); // Sunday

    const todayTasks = tasks.filter(task => task.date === todayStr);
    const weekTasks = getTasksByWeek(thisWeekStart, thisWeekEnd);
    const completedTasks = tasks.filter(task => task.completed);

    return {
      totalTasks: tasks.length,
      completedTasks: completedTasks.length,
      completionRate: tasks.length > 0 ? (completedTasks.length / tasks.length) * 100 : 0,
      tasksToday: todayTasks.length,
      tasksThisWeek: weekTasks.length,
    };
  }, [tasks, getTasksByWeek]);

  return {
    tasks,
    isLoading,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskComplete,
    getTasksByDate,
    getTasksByWeek,
    getStats,
  };
}