'use client';

import { useState } from 'react';
import { Task, TaskStatus, CreateTaskDto, UpdateTaskDto } from '@/types/task';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { X } from 'lucide-react';

interface TaskFormProps {
  task?: Task;
  onSubmit: (data: CreateTaskDto | UpdateTaskDto) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

const statusOptions = [
  { value: TaskStatus.TODO, label: 'To Do' },
  { value: TaskStatus.IN_PROGRESS, label: 'In Progress' },
  { value: TaskStatus.DONE, label: 'Done' },
];

export function TaskForm({ task, onSubmit, onCancel, loading }: TaskFormProps) {
  const [formData, setFormData] = useState({
    title: task?.title || '',
    description: task?.description || '',
    status: task?.status || TaskStatus.TODO,
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setErrors({});
    
    try {
      await onSubmit({
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        status: formData.status,
      });
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md animate-fade-in">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-xl">
            {task ? 'Edit Task' : 'Create New Task'}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-2">
                Title *
              </label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="Enter task title"
                error={errors.title}
                disabled={loading}
              />
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium mb-2">
                Description
              </label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Enter task description (optional)"
                rows={3}
                disabled={loading}
              />
            </div>
            
            <div>
              <label htmlFor="status" className="block text-sm font-medium mb-2">
                Status
              </label>
              <Select
                id="status"
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value as TaskStatus)}
                options={statusOptions}
                disabled={loading}
              />
            </div>
            
            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                loading={loading}
                className="flex-1"
              >
                {task ? 'Update Task' : 'Create Task'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={loading}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
