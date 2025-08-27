'use client';

import { TaskStats } from '@/types/task';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { CheckCircle, Clock, Circle, BarChart3 } from 'lucide-react';

interface TaskStatsProps {
  stats: TaskStats;
  loading?: boolean;
}

export function TaskStatsComponent({ stats, loading }: TaskStatsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 bg-muted rounded w-16"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded w-12"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const statItems = [
    {
      title: 'Total Tasks',
      value: stats.total,
      icon: BarChart3,
      color: 'text-foreground',
    },
    {
      title: 'To Do',
      value: stats.todo,
      icon: Circle,
      color: 'text-muted-foreground',
    },
    {
      title: 'In Progress',
      value: stats.inProgress,
      icon: Clock,
      color: 'text-warning',
    },
    {
      title: 'Completed',
      value: stats.done,
      icon: CheckCircle,
      color: 'text-success',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      {statItems.map((item) => {
        const Icon = item.icon;
        return (
          <Card key={item.title} className="animate-fade-in">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {item.title}
              </CardTitle>
              <Icon className={`h-4 w-4 ${item.color}`} />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${item.color}`}>
                {item.value}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
