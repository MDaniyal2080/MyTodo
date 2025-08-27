import { IsEnum, IsOptional } from 'class-validator';
import { TaskStatus } from '@prisma/client';

export class FilterTasksDto {
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;
}
