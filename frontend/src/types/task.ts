export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskDto {
  title: string;
  description?: string;
  status?: TaskStatus;
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  status?: TaskStatus;
}

export interface TaskStats {
  total: number;
  todo: number;
  inProgress: number;
  done: number;
}
