'use client';

import { Task, TaskStatus } from '@/types/task';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Pencil, Trash2, Clock, CheckCircle, Circle } from 'lucide-react';
import { clsx } from 'clsx';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
  onStatusChange: (id: number, status: TaskStatus) => void;
}

const statusConfig = {
  [TaskStatus.TODO]: {
    label: 'To Do',
    icon: Circle,
    color: 'text-muted-foreground',
    bgColor: 'bg-muted',
  },
  [TaskStatus.IN_PROGRESS]: {
    label: 'In Progress',
    icon: Clock,
    color: 'text-warning',
    bgColor: 'bg-warning/10',
  },
  [TaskStatus.DONE]: {
    label: 'Done',
    icon: CheckCircle,
    color: 'text-success',
    bgColor: 'bg-success/10',
  },
};

export function TaskCard({ task, onEdit, onDelete, onStatusChange }: TaskCardProps) {
  const config = statusConfig[task.status];
  const StatusIcon = config.icon;

  const handleStatusCycle = () => {
    const statusOrder = [TaskStatus.TODO, TaskStatus.IN_PROGRESS, TaskStatus.DONE];
    const currentIndex = statusOrder.indexOf(task.status);
    const nextIndex = (currentIndex + 1) % statusOrder.length;
    onStatusChange(task.id, statusOrder[nextIndex]);
  };

  return (
    <Card className="animate-fade-in hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-medium leading-6">{task.title}</CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(task)}
              className="h-8 w-8 p-0"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(task.id)}
              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      {task.description && (
        <CardContent className="py-0">
          <p className="text-sm text-muted-foreground leading-relaxed">
            {task.description}
          </p>
        </CardContent>
      )}
      
      <CardFooter className="flex items-center justify-between pt-4">
        <button
          onClick={handleStatusCycle}
          className={clsx(
            'flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-colors hover:opacity-80',
            config.color,
            config.bgColor
          )}
        >
          <StatusIcon className="h-3.5 w-3.5" />
          {config.label}
        </button>
        
        <time className="text-xs text-muted-foreground">
          {new Date(task.createdAt).toLocaleDateString()}
        </time>
      </CardFooter>
    </Card>
  );
}
