import { format, startOfWeek, endOfWeek, eachDayOfInterval, isToday, isSameDay, addDays, subDays } from 'date-fns';

export const formatDate = (date: Date): string => {
  return format(date, 'yyyy-MM-dd');
};

export const formatDisplayDate = (date: Date): string => {
  return format(date, 'EEEE, MMMM d, yyyy');
};

export const formatTime = (date: Date): string => {
  return format(date, 'HH:mm');
};

export const formatTimeSlot = (time: string): string => {
  const [hours, minutes] = time.split(':').map(Number);
  const date = new Date();
  date.setHours(hours, minutes);
  return format(date, 'h:mm a');
};

export const getWeekDates = (date: Date = new Date()) => {
  const start = startOfWeek(date, { weekStartsOn: 1 }); // Monday
  const end = endOfWeek(date, { weekStartsOn: 1 });
  
  return eachDayOfInterval({ start, end });
};

export const getWeekRange = (date: Date = new Date()) => {
  const start = startOfWeek(date, { weekStartsOn: 1 });
  const end = endOfWeek(date, { weekStartsOn: 1 });
  
  return {
    start,
    end,
    label: `${format(start, 'MMM d')} - ${format(end, 'MMM d, yyyy')}`,
  };
};

export const isDateToday = (date: Date): boolean => {
  return isToday(date);
};

export const isSameDate = (date1: Date, date2: Date): boolean => {
  return isSameDay(date1, date2);
};

export const getNextDay = (date: Date): Date => {
  return addDays(date, 1);
};

export const getPreviousDay = (date: Date): Date => {
  return subDays(date, 1);
};

export const getDayName = (date: Date): string => {
  return format(date, 'EEEE');
};

export const getShortDayName = (date: Date): string => {
  return format(date, 'EEE');
};

export const getMonthName = (date: Date): string => {
  return format(date, 'MMMM yyyy');
};

export const createTimeSlots = (startHour: number = 6, endHour: number = 22): string[] => {
  const slots: string[] = [];
  
  for (let hour = startHour; hour <= endHour; hour++) {
    slots.push(`${hour.toString().padStart(2, '0')}:00`);
  }
  
  return slots;
};