import { Task, CreateTaskDto, UpdateTaskDto, TaskStats, TaskStatus } from '@/types/task';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new ApiError(response.status, errorText || 'An error occurred');
  }

  return response.json();
}

export const taskApi = {
  // Get all tasks with optional status filter
  async getTasks(status?: TaskStatus): Promise<Task[]> {
    const params = status ? `?status=${status}` : '';
    return fetchApi<Task[]>(`/tasks${params}`);
  },

  // Get task statistics
  async getTaskStats(): Promise<TaskStats> {
    return fetchApi<TaskStats>('/tasks/stats');
  },

  // Get a single task by ID
  async getTask(id: number): Promise<Task> {
    return fetchApi<Task>(`/tasks/${id}`);
  },

  // Create a new task
  async createTask(data: CreateTaskDto): Promise<Task> {
    return fetchApi<Task>('/tasks', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Update an existing task
  async updateTask(id: number, data: UpdateTaskDto): Promise<Task> {
    return fetchApi<Task>(`/tasks/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  // Delete a task
  async deleteTask(id: number): Promise<Task> {
    return fetchApi<Task>(`/tasks/${id}`, {
      method: 'DELETE',
    });
  },
};

export { ApiError };
