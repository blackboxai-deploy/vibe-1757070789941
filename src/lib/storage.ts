import { Task, Goal, Category } from './types';
import { STORAGE_KEYS, DEFAULT_CATEGORIES } from './constants';

export class LocalStorageService {
  static getTasks(): Task[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const tasks = localStorage.getItem(STORAGE_KEYS.TASKS);
      if (tasks) {
        return JSON.parse(tasks).map((task: any) => ({
          ...task,
          createdAt: new Date(task.createdAt),
          updatedAt: new Date(task.updatedAt),
        }));
      }
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
    return [];
  }

  static saveTasks(tasks: Task[]): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
    } catch (error) {
      console.error('Error saving tasks:', error);
    }
  }

  static getGoals(): Goal[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const goals = localStorage.getItem(STORAGE_KEYS.GOALS);
      if (goals) {
        return JSON.parse(goals).map((goal: any) => ({
          ...goal,
          deadline: new Date(goal.deadline),
          createdAt: new Date(goal.createdAt),
        }));
      }
    } catch (error) {
      console.error('Error loading goals:', error);
    }
    return [];
  }

  static saveGoals(goals: Goal[]): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
    } catch (error) {
      console.error('Error saving goals:', error);
    }
  }

  static getCategories(): Category[] {
    if (typeof window === 'undefined') return DEFAULT_CATEGORIES;
    
    try {
      const categories = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      if (categories) {
        return JSON.parse(categories);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
    }
    
    // Initialize with default categories if none exist
    this.saveCategories(DEFAULT_CATEGORIES);
    return DEFAULT_CATEGORIES;
  }

  static saveCategories(categories: Category[]): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    } catch (error) {
      console.error('Error saving categories:', error);
    }
  }

  static clearAllData(): void {
    if (typeof window === 'undefined') return;
    
    try {
      Object.values(STORAGE_KEYS).forEach((key: string) => {
        localStorage.removeItem(key);
      });
    } catch (error) {
      console.error('Error clearing data:', error);
    }
  }
}