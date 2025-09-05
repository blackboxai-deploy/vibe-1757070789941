import { Category, TimeSlot } from './types';

export const DEFAULT_CATEGORIES: Category[] = [
  { id: '1', name: 'Work', color: '#3B82F6' },
  { id: '2', name: 'Personal', color: '#10B981' },
  { id: '3', name: 'Health', color: '#F59E0B' },
  { id: '4', name: 'Learning', color: '#8B5CF6' },
  { id: '5', name: 'Social', color: '#EF4444' },
  { id: '6', name: 'Finance', color: '#06B6D4' },
];

export const TIME_SLOTS: TimeSlot[] = [
  { id: '1', time: '06:00', duration: 60 },
  { id: '2', time: '07:00', duration: 60 },
  { id: '3', time: '08:00', duration: 60 },
  { id: '4', time: '09:00', duration: 60 },
  { id: '5', time: '10:00', duration: 60 },
  { id: '6', time: '11:00', duration: 60 },
  { id: '7', time: '12:00', duration: 60 },
  { id: '8', time: '13:00', duration: 60 },
  { id: '9', time: '14:00', duration: 60 },
  { id: '10', time: '15:00', duration: 60 },
  { id: '11', time: '16:00', duration: 60 },
  { id: '12', time: '17:00', duration: 60 },
  { id: '13', time: '18:00', duration: 60 },
  { id: '14', time: '19:00', duration: 60 },
  { id: '15', time: '20:00', duration: 60 },
  { id: '16', time: '21:00', duration: 60 },
  { id: '17', time: '22:00', duration: 60 },
];

export const PRIORITY_COLORS = {
  high: '#EF4444',
  medium: '#F59E0B',
  low: '#10B981',
};

export const PRIORITY_LABELS = {
  high: 'High Priority',
  medium: 'Medium Priority',
  low: 'Low Priority',
};

export const STORAGE_KEYS = {
  TASKS: 'planner_tasks',
  GOALS: 'planner_goals',
  CATEGORIES: 'planner_categories',
  SETTINGS: 'planner_settings',
};