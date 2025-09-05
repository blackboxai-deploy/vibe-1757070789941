'use client';

import { useState } from 'react';
import { Task } from '@/lib/types';
import { formatTimeSlot } from '@/lib/dateUtils';
import { PRIORITY_COLORS } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface TaskCardProps {
  task: Task;
  categories: Array<{ id: string; name: string; color: string }>;
  onToggleComplete: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export function TaskCard({ task, categories, onToggleComplete, onEdit, onDelete }: TaskCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  const category = categories.find(c => c.id === task.category);
  const priorityColor = PRIORITY_COLORS[task.priority];

  const handleToggleComplete = () => {
    onToggleComplete(task.id);
  };

  return (
    <Card
      className={`transition-all duration-200 hover:shadow-md ${
        task.completed ? 'opacity-60 bg-gray-50' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        borderLeftWidth: '4px',
        borderLeftColor: priorityColor,
      }}
    >
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <Checkbox
            checked={task.completed}
            onCheckedChange={handleToggleComplete}
            className="mt-1"
          />
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3
                className={`font-medium text-sm ${
                  task.completed ? 'line-through text-gray-500' : 'text-gray-900'
                }`}
              >
                {task.title}
              </h3>
              
              {isHovered && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <span className="text-gray-400">⋮</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(task)}>
                      Edit Task
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => onDelete(task.id)}
                      className="text-red-600"
                    >
                      Delete Task
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
            
            {task.description && (
              <p className={`text-xs mt-1 ${
                task.completed ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {task.description}
              </p>
            )}
            
            <div className="flex items-center space-x-2 mt-2">
              {category && (
                <Badge
                  variant="outline"
                  style={{ backgroundColor: `${category.color}20`, color: category.color }}
                  className="text-xs"
                >
                  {category.name}
                </Badge>
              )}
              
              <Badge variant="outline" className="text-xs capitalize">
                {task.priority} Priority
              </Badge>
              
              {task.timeSlot && (
                <Badge variant="secondary" className="text-xs">
                  {formatTimeSlot(task.timeSlot)}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}