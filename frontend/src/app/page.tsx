'use client';

import { useState, useEffect, useCallback } from 'react';
import { Task, TaskStatus, CreateTaskDto, UpdateTaskDto, TaskStats } from '@/types/task';
import { taskApi } from '@/lib/api';
import { TaskCard } from '@/components/TaskCard';
import { TaskForm } from '@/components/TaskForm';
import { TaskStatsComponent } from '@/components/TaskStats';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Plus, Filter, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

const filterOptions = [
  { value: '', label: 'All Tasks' },
  { value: TaskStatus.TODO, label: 'To Do' },
  { value: TaskStatus.IN_PROGRESS, label: 'In Progress' },
  { value: TaskStatus.DONE, label: 'Done' },
];

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<TaskStats>({ total: 0, todo: 0, inProgress: 0, done: 0 });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<TaskStatus | ''>('');
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  // Fetch tasks and stats
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [tasksData, statsData] = await Promise.all([
        taskApi.getTasks(filter || undefined),
        taskApi.getTaskStats(),
      ]);
      setTasks(tasksData);
      setStats(statsData);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handle task creation
  const handleCreateTask = async (data: CreateTaskDto) => {
    try {
      setFormLoading(true);
      await taskApi.createTask(data);
      toast.success('Task created successfully!');
      setShowForm(false);
      fetchData();
    } catch (error) {
      console.error('Error creating task:', error);
      toast.error('Failed to create task');
    } finally {
      setFormLoading(false);
    }
  };

  // Handle task update
  const handleUpdateTask = async (data: UpdateTaskDto) => {
    if (!editingTask) return;
    
    try {
      setFormLoading(true);
      await taskApi.updateTask(editingTask.id, data);
      toast.success('Task updated successfully!');
      setEditingTask(null);
      fetchData();
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Failed to update task');
    } finally {
      setFormLoading(false);
    }
  };

  // Handle task deletion
  const handleDeleteTask = async (id: number) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    
    try {
      await taskApi.deleteTask(id);
      toast.success('Task deleted successfully!');
      fetchData();
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task');
    }
  };

  // Handle status change
  const handleStatusChange = async (id: number, status: TaskStatus) => {
    try {
      await taskApi.updateTask(id, { status });
      toast.success('Task status updated!');
      fetchData();
    } catch (error) {
      console.error('Error updating task status:', error);
      toast.error('Failed to update task status');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Task Manager
          </h1>
          <p className="text-muted-foreground">
            Organize your tasks with a modern, clean interface
          </p>
        </div>

        {/* Stats */}
        <TaskStatsComponent stats={stats} loading={loading} />

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <Button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add New Task
          </Button>
          
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select
              value={filter}
              onChange={(e) => setFilter(e.target.value as TaskStatus | '')}
              options={filterOptions}
              className="w-40"
            />
          </div>
          
          <Button
            variant="outline"
            onClick={fetchData}
            disabled={loading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Task Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-card border rounded-lg p-6 space-y-4">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-full"></div>
                  <div className="h-3 bg-muted rounded w-2/3"></div>
                  <div className="flex justify-between items-center">
                    <div className="h-6 bg-muted rounded w-16"></div>
                    <div className="h-3 bg-muted rounded w-20"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-muted-foreground mb-4">
              {filter ? 'No tasks found with the selected filter.' : 'No tasks yet.'}
            </div>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create your first task
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={setEditingTask}
                onDelete={handleDeleteTask}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        )}

        {/* Task Form Modal */}
        {showForm && (
          <TaskForm
            onSubmit={handleCreateTask}
            onCancel={() => setShowForm(false)}
            loading={formLoading}
          />
        )}

        {editingTask && (
          <TaskForm
            task={editingTask}
            onSubmit={handleUpdateTask}
            onCancel={() => setEditingTask(null)}
            loading={formLoading}
          />
        )}
      </div>
    </div>
  );
}
