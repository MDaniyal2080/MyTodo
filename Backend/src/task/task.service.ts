import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { FilterTasksDto } from './dto/filter-tasks.dto';
import { Task, TaskStatus } from '@prisma/client';

@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService) {}

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    return this.prisma.task.create({
      data: {
        title: createTaskDto.title,
        description: createTaskDto.description,
        status: createTaskDto.status ?? TaskStatus.TODO,
      },
    });
  }

  async findAll(filterDto?: FilterTasksDto): Promise<Task[]> {
    const where = filterDto?.status ? { status: filterDto.status } : {};

    return this.prisma.task.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number): Promise<Task> {
    const task = await this.prisma.task.findUnique({
      where: { id },
    });

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return task;
  }

  async update(id: number, updateTaskDto: UpdateTaskDto): Promise<Task> {
    await this.findOne(id); // This will throw NotFoundException if task doesn't exist

    return this.prisma.task.update({
      where: { id },
      data: updateTaskDto,
    });
  }

  async remove(id: number): Promise<Task> {
    await this.findOne(id); // This will throw NotFoundException if task doesn't exist

    return this.prisma.task.delete({
      where: { id },
    });
  }

  async getTaskStats() {
    const totalTasks = await this.prisma.task.count();
    const todoTasks = await this.prisma.task.count({
      where: { status: TaskStatus.TODO },
    });
    const inProgressTasks = await this.prisma.task.count({
      where: { status: TaskStatus.IN_PROGRESS },
    });
    const doneTasks = await this.prisma.task.count({
      where: { status: TaskStatus.DONE },
    });

    return {
      total: totalTasks,
      todo: todoTasks,
      inProgress: inProgressTasks,
      done: doneTasks,
    };
  }
}
