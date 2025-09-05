'use client';

import { useState } from 'react';
import { Goal } from '@/lib/types';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface GoalCardProps {
  goal: Goal;
  onEdit: (goal: Goal) => void;
  onDelete: (id: string) => void;
  onUpdateProgress: (id: string, progress: number) => void;
}

export function GoalCard({ goal, onEdit, onDelete, onUpdateProgress }: GoalCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  const progressPercentage = goal.target > 0 ? (goal.progress / goal.target) * 100 : 0;
  const isCompleted = goal.progress >= goal.target;
  const isOverdue = new Date() > goal.deadline && !isCompleted;

  const handleProgressIncrement = () => {
    if (goal.progress < goal.target) {
      onUpdateProgress(goal.id, goal.progress + 1);
    }
  };

  const handleProgressDecrement = () => {
    if (goal.progress > 0) {
      onUpdateProgress(goal.id, goal.progress - 1);
    }
  };

  const getTypeColor = (type: Goal['type']) => {
    switch (type) {
      case 'daily':
        return 'bg-blue-100 text-blue-800';
      case 'weekly':
        return 'bg-green-100 text-green-800';
      case 'monthly':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = () => {
    if (isCompleted) return 'text-green-600';
    if (isOverdue) return 'text-red-600';
    return 'text-blue-600';
  };

  return (
    <Card
      className={`transition-all duration-200 hover:shadow-md ${
        isCompleted ? 'ring-2 ring-green-200 bg-green-50' : ''
      } ${isOverdue ? 'ring-2 ring-red-200 bg-red-50' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <CardTitle className={`text-lg ${isCompleted ? 'line-through text-gray-500' : ''}`}>
                {goal.title}
              </CardTitle>
              <Badge className={getTypeColor(goal.type)} variant="secondary">
                {goal.type}
              </Badge>
            </div>
            
            {goal.description && (
              <p className="text-sm text-gray-600 mb-2">
                {goal.description}
              </p>
            )}
            
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>Target: {goal.target}</span>
              <span>Deadline: {format(goal.deadline, 'MMM dd, yyyy')}</span>
              {isOverdue && (
                <Badge variant="destructive" className="text-xs">
                  Overdue
                </Badge>
              )}
            </div>
          </div>
          
          {isHovered && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <span className="text-gray-400">⋮</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(goal)}>
                  Edit Goal
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onDelete(goal.id)}
                  className="text-red-600"
                >
                  Delete Goal
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Progress</span>
              <span className={`text-sm font-bold ${getStatusColor()}`}>
                {goal.progress} / {goal.target} ({Math.round(progressPercentage)}%)
              </span>
            </div>
            <Progress 
              value={progressPercentage} 
              className="h-3"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleProgressDecrement}
                disabled={goal.progress <= 0}
              >
                -
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleProgressIncrement}
                disabled={goal.progress >= goal.target}
              >
                +
              </Button>
            </div>
            
            {isCompleted && (
              <div className="flex items-center space-x-1 text-green-600">
                <span className="text-lg">✅</span>
                <span className="text-sm font-medium">Completed!</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}