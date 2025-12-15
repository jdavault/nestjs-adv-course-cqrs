import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProjectStatus } from '../project.entity';

export class CreateProjectDto {
  @ApiProperty({ example: 'a1b2c3d4...', description: 'Owner user ID' })
  userId: string;

  @ApiProperty({ example: 'My Project', description: 'Project name' })
  name: string;

  @ApiPropertyOptional({ example: 'Project description', description: 'Description' })
  description?: string;

  @ApiPropertyOptional({ enum: ProjectStatus, description: 'Project status' })
  status?: ProjectStatus;

  @ApiPropertyOptional({ example: '2024-12-31', description: 'Deadline' })
  deadline?: Date;
}

export class UpdateProjectDto {
  @ApiPropertyOptional({ example: 'Updated Project Name' })
  name?: string;

  @ApiPropertyOptional({ example: 'Updated description' })
  description?: string;

  @ApiPropertyOptional({ enum: ProjectStatus })
  status?: ProjectStatus;

  @ApiPropertyOptional({ example: '2024-12-31' })
  deadline?: Date;
}

export class ProjectResponseDto {
  @ApiProperty({ example: 'a1b2c3d4e5f6...' })
  projectId: string;

  @ApiProperty({ example: 'a1b2c3d4e5f6...' })
  userId: string;

  @ApiProperty({ example: 'My Project' })
  name: string;

  @ApiPropertyOptional({ example: 'Project description' })
  description?: string;

  @ApiProperty({ enum: ProjectStatus })
  status: ProjectStatus;

  @ApiPropertyOptional()
  deadline?: Date;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class DeleteProjectResponseDto {
  @ApiProperty({ example: true })
  deleted: boolean;

  @ApiProperty({ example: 'a1b2c3d4e5f6...' })
  projectId: string;
}
