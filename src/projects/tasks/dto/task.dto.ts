import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TaskStatus, TaskPriority } from '../task.entity';

export class CreateTaskDto {
  @ApiProperty({ example: 'Build login page', description: 'Task title' })
  title: string;

  @ApiPropertyOptional({ example: 'Create the login form with validation' })
  description?: string;

  @ApiPropertyOptional({ example: 'a1b2c3d4...', description: 'Assignee user ID' })
  assigneeId?: string;

  @ApiPropertyOptional({ enum: TaskStatus, default: TaskStatus.TODO })
  status?: TaskStatus;

  @ApiPropertyOptional({ enum: TaskPriority, default: TaskPriority.MEDIUM })
  priority?: TaskPriority;

  @ApiPropertyOptional({ example: '2024-12-31' })
  dueDate?: Date;
}

export class UpdateTaskDto {
  @ApiPropertyOptional({ example: 'Updated task title' })
  title?: string;

  @ApiPropertyOptional({ example: 'Updated description' })
  description?: string;

  @ApiPropertyOptional({ example: 'a1b2c3d4...' })
  assigneeId?: string;

  @ApiPropertyOptional({ enum: TaskStatus })
  status?: TaskStatus;

  @ApiPropertyOptional({ enum: TaskPriority })
  priority?: TaskPriority;

  @ApiPropertyOptional({ example: '2024-12-31' })
  dueDate?: Date;
}

export class TaskResponseDto {
  @ApiProperty({ example: 'a1b2c3d4e5f6...' })
  taskId: string;

  @ApiProperty({ example: 'a1b2c3d4e5f6...' })
  projectId: string;

  @ApiPropertyOptional({ example: 'a1b2c3d4e5f6...' })
  assigneeId?: string;

  @ApiProperty({ example: 'Build login page' })
  title: string;

  @ApiPropertyOptional({ example: 'Task description' })
  description?: string;

  @ApiProperty({ enum: TaskStatus })
  status: TaskStatus;

  @ApiProperty({ enum: TaskPriority })
  priority: TaskPriority;

  @ApiPropertyOptional()
  dueDate?: Date;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class DeleteTaskResponseDto {
  @ApiProperty({ example: true })
  deleted: boolean;

  @ApiProperty({ example: 'a1b2c3d4e5f6...' })
  taskId: string;
}
