'use client';

import { useState, useEffect, useCallback } from 'react';
import { Goal } from '@/lib/types';
import { LocalStorageService } from '@/lib/storage';

export function useGoals() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadedGoals = LocalStorageService.getGoals();
    setGoals(loadedGoals);
    setIsLoading(false);
  }, []);

  const saveGoals = useCallback((newGoals: Goal[]) => {
    setGoals(newGoals);
    LocalStorageService.saveGoals(newGoals);
  }, []);

  const addGoal = useCallback((goalData: Omit<Goal, 'id' | 'createdAt'>) => {
    const newGoal: Goal = {
      ...goalData,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    
    const updatedGoals = [...goals, newGoal];
    saveGoals(updatedGoals);
  }, [goals, saveGoals]);

  const updateGoal = useCallback((id: string, updates: Partial<Goal>) => {
    const updatedGoals = goals.map(goal =>
      goal.id === id ? { ...goal, ...updates } : goal
    );
    saveGoals(updatedGoals);
  }, [goals, saveGoals]);

  const deleteGoal = useCallback((id: string) => {
    const updatedGoals = goals.filter(goal => goal.id !== id);
    saveGoals(updatedGoals);
  }, [goals, saveGoals]);

  const updateProgress = useCallback((id: string, progress: number) => {
    updateGoal(id, { progress });
  }, [updateGoal]);

  const getGoalsByType = useCallback((type: Goal['type']) => {
    return goals.filter(goal => goal.type === type);
  }, [goals]);

  const getActiveGoals = useCallback(() => {
    const now = new Date();
    return goals.filter(goal => goal.deadline >= now);
  }, [goals]);

  const getCompletedGoals = useCallback(() => {
    return goals.filter(goal => goal.progress >= goal.target);
  }, [goals]);

  const getGoalProgress = useCallback((id: string) => {
    const goal = goals.find(g => g.id === id);
    if (!goal) return 0;
    return goal.target > 0 ? (goal.progress / goal.target) * 100 : 0;
  }, [goals]);

  return {
    goals,
    isLoading,
    addGoal,
    updateGoal,
    deleteGoal,
    updateProgress,
    getGoalsByType,
    getActiveGoals,
    getCompletedGoals,
    getGoalProgress,
  };
}