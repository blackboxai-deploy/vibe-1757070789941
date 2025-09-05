'use client';

import { useState, useEffect } from 'react';
import { Goal } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface GoalFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (goal: Omit<Goal, 'id' | 'createdAt'>) => void;
  editingGoal?: Goal | null;
}

export function GoalForm({
  isOpen,
  onClose,
  onSubmit,
  editingGoal,
}: GoalFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'weekly' as const,
    target: 1,
    progress: 0,
    deadline: '',
  });

  useEffect(() => {
    if (editingGoal) {
      setFormData({
        title: editingGoal.title,
        description: editingGoal.description || '',
        type: editingGoal.type,
        target: editingGoal.target,
        progress: editingGoal.progress,
        deadline: editingGoal.deadline.toISOString().split('T')[0],
      });
    } else {
      // Set default deadline based on goal type
      const today = new Date();
      let defaultDeadline = new Date();
      
      switch (formData.type) {
        case 'daily':
          defaultDeadline = new Date(today.getTime() + 24 * 60 * 60 * 1000);
          break;
        case 'weekly':
          defaultDeadline = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
          break;
        case 'monthly':
          defaultDeadline = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
          break;
      }
      
      setFormData(prev => ({
        ...prev,
        title: '',
        description: '',
        progress: 0,
        deadline: defaultDeadline.toISOString().split('T')[0],
      }));
    }
  }, [editingGoal, isOpen, formData.type]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.deadline) return;

    onSubmit({
      title: formData.title.trim(),
      description: formData.description.trim() || undefined,
      type: formData.type,
      target: formData.target,
      progress: formData.progress,
      deadline: new Date(formData.deadline),
    });

    onClose();
  };

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleTypeChange = (newType: 'daily' | 'weekly' | 'monthly') => {
    const today = new Date();
    let newDeadline = new Date();
    
    switch (newType) {
      case 'daily':
        newDeadline = new Date(today.getTime() + 24 * 60 * 60 * 1000);
        break;
      case 'weekly':
        newDeadline = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
        break;
      case 'monthly':
        newDeadline = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
        break;
    }
    
    setFormData(prev => ({
      ...prev,
      type: newType,
      deadline: newDeadline.toISOString().split('T')[0],
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {editingGoal ? 'Edit Goal' : 'Add New Goal'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Goal Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Enter goal title"
              className="mt-1"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Optional goal description"
              className="mt-1"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Goal Type</Label>
              <Select
                value={formData.type}
                onValueChange={handleTypeChange}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily Goal</SelectItem>
                  <SelectItem value="weekly">Weekly Goal</SelectItem>
                  <SelectItem value="monthly">Monthly Goal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="target">Target *</Label>
              <Input
                id="target"
                type="number"
                value={formData.target}
                onChange={(e) => handleChange('target', parseInt(e.target.value) || 1)}
                min="1"
                className="mt-1"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="progress">Current Progress</Label>
              <Input
                id="progress"
                type="number"
                value={formData.progress}
                onChange={(e) => handleChange('progress', parseInt(e.target.value) || 0)}
                min="0"
                max={formData.target}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="deadline">Deadline *</Label>
              <Input
                id="deadline"
                type="date"
                value={formData.deadline}
                onChange={(e) => handleChange('deadline', e.target.value)}
                className="mt-1"
                required
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {editingGoal ? 'Update Goal' : 'Add Goal'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}