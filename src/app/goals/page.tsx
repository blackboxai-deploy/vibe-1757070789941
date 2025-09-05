'use client';

import { useState } from 'react';
import { Goal } from '@/lib/types';
import { useGoals } from '@/hooks/useGoals';
import { GoalCard } from '@/components/goals/GoalCard';
import { GoalForm } from '@/components/goals/GoalForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function GoalsPage() {
  const [isGoalFormOpen, setIsGoalFormOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  
  const {
    goals,
    isLoading,
    addGoal,
    updateGoal,
    deleteGoal,
    updateProgress,
    getGoalsByType,
    getActiveGoals,
    getCompletedGoals,
  } = useGoals();

  const allGoals = goals;
  const activeGoals = getActiveGoals();
  const completedGoals = getCompletedGoals();
  const dailyGoals = getGoalsByType('daily');
  const weeklyGoals = getGoalsByType('weekly');
  const monthlyGoals = getGoalsByType('monthly');

  const handleEditGoal = (goal: Goal) => {
    setEditingGoal(goal);
    setIsGoalFormOpen(true);
  };

  const handleSubmitGoal = (goalData: Omit<Goal, 'id' | 'createdAt'>) => {
    if (editingGoal) {
      updateGoal(editingGoal.id, goalData);
    } else {
      addGoal(goalData);
    }
    setEditingGoal(null);
    setIsGoalFormOpen(false);
  };

  const handleCloseForm = () => {
    setIsGoalFormOpen(false);
    setEditingGoal(null);
  };

  const getGoalsForTab = (tab: string) => {
    switch (tab) {
      case 'active':
        return activeGoals;
      case 'completed':
        return completedGoals;
      case 'daily':
        return dailyGoals;
      case 'weekly':
        return weeklyGoals;
      case 'monthly':
        return monthlyGoals;
      default:
        return allGoals;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading goals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Goals</h1>
          <p className="text-gray-600">Track and manage your daily, weekly, and monthly goals</p>
        </div>
        <Button onClick={() => setIsGoalFormOpen(true)}>
          + Add Goal
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{allGoals.length}</div>
            <div className="text-sm text-gray-500">Total Goals</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{activeGoals.length}</div>
            <div className="text-sm text-gray-500">Active Goals</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{completedGoals.length}</div>
            <div className="text-sm text-gray-500">Completed</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">
              {allGoals.length > 0 ? Math.round((completedGoals.length / allGoals.length) * 100) : 0}%
            </div>
            <div className="text-sm text-gray-500">Success Rate</div>
          </CardContent>
        </Card>
      </div>

      {/* Goals Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="all" className="flex items-center space-x-1">
            <span>All</span>
            <Badge variant="secondary" className="ml-1 text-xs">
              {allGoals.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="active" className="flex items-center space-x-1">
            <span>Active</span>
            <Badge variant="secondary" className="ml-1 text-xs">
              {activeGoals.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex items-center space-x-1">
            <span>Completed</span>
            <Badge variant="secondary" className="ml-1 text-xs">
              {completedGoals.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="daily" className="flex items-center space-x-1">
            <span>Daily</span>
            <Badge variant="secondary" className="ml-1 text-xs">
              {dailyGoals.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="weekly" className="flex items-center space-x-1">
            <span>Weekly</span>
            <Badge variant="secondary" className="ml-1 text-xs">
              {weeklyGoals.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="monthly" className="flex items-center space-x-1">
            <span>Monthly</span>
            <Badge variant="secondary" className="ml-1 text-xs">
              {monthlyGoals.length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        {['all', 'active', 'completed', 'daily', 'weekly', 'monthly'].map((tab) => (
          <TabsContent key={tab} value={tab} className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {getGoalsForTab(tab).length > 0 ? (
                getGoalsForTab(tab).map((goal) => (
                  <GoalCard
                    key={goal.id}
                    goal={goal}
                    onEdit={handleEditGoal}
                    onDelete={deleteGoal}
                    onUpdateProgress={updateProgress}
                  />
                ))
              ) : (
                <div className="col-span-full">
                  <Card>
                    <CardContent className="p-8 text-center">
                      <div className="text-4xl mb-4">🎯</div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No {tab === 'all' ? '' : tab} goals yet
                      </h3>
                      <p className="text-gray-500 mb-4">
                        {tab === 'all' 
                          ? "Start by adding your first goal to track your progress."
                          : `No ${tab} goals found. Create a new goal to get started.`
                        }
                      </p>
                      <Button onClick={() => setIsGoalFormOpen(true)}>
                        Add Your First Goal
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Goal Form Modal */}
      <GoalForm
        isOpen={isGoalFormOpen}
        onClose={handleCloseForm}
        onSubmit={handleSubmitGoal}
        editingGoal={editingGoal}
      />
    </div>
  );
}