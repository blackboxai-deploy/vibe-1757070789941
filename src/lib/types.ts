export interface Task {
  id: string;
  title: string;
  description?: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
  timeSlot?: string;
  date: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon?: string;
}

export interface Goal {
  id: string;
  title: string;
  description?: string;
  type: 'daily' | 'weekly' | 'monthly';
  target: number;
  progress: number;
  deadline: Date;
  createdAt: Date;
}

export interface TimeSlot {
  id: string;
  time: string;
  duration: number; // in minutes
}

export interface PlannerStats {
  totalTasks: number;
  completedTasks: number;
  completionRate: number;
  tasksToday: number;
  tasksThisWeek: number;
}

export type PriorityLevel = 'high' | 'medium' | 'low';
export type GoalType = 'daily' | 'weekly' | 'monthly';
export type ViewMode = 'daily' | 'weekly' | 'monthly';