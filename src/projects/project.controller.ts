import {
  Get,
  Post,
  Put,
  Delete,
  Param,
  Controller,
  Body,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateProjectCommand } from './commands/impl/create-project.command';
import { UpdateProjectCommand } from './commands/impl/update-project.command';
import { DeleteProjectCommand } from './commands/impl/delete-project.command';
import { GetProjectQuery } from './queries/impl/get-project.query';
import { GetAllProjectsQuery } from './queries/impl/get-all-projects.query';
import { GetProjectsByUserQuery } from './queries/impl/get-projects-by-user.query';
import {
  CreateProjectDto,
  UpdateProjectDto,
  ProjectResponseDto,
  DeleteProjectResponseDto,
} from './dto/project.dto';

@ApiTags('projects')
@Controller('projects')
export class ProjectController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new project' })
  @ApiBody({ type: CreateProjectDto })
  @ApiResponse({ status: 201, description: 'Project created', type: ProjectResponseDto })
  async createProject(@Body() input: CreateProjectDto) {
    return this.commandBus.execute(
      new CreateProjectCommand(
        input.userId,
        input.name,
        input.description,
        input.status,
        input.deadline,
      ),
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get all projects' })
  @ApiResponse({ status: 200, description: 'List of projects', type: [ProjectResponseDto] })
  async getAllProjects() {
    return this.queryBus.execute(new GetAllProjectsQuery());
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get projects by user ID' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'List of user projects', type: [ProjectResponseDto] })
  async getProjectsByUser(@Param('userId') userId: string) {
    return this.queryBus.execute(new GetProjectsByUserQuery(userId));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get project by ID' })
  @ApiParam({ name: 'id', description: 'Project ID' })
  @ApiResponse({ status: 200, description: 'Project found', type: ProjectResponseDto })
  @ApiResponse({ status: 404, description: 'Project not found' })
  async getProject(@Param('id') id: string) {
    return this.queryBus.execute(new GetProjectQuery(id));
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update project' })
  @ApiParam({ name: 'id', description: 'Project ID' })
  @ApiBody({ type: UpdateProjectDto })
  @ApiResponse({ status: 200, description: 'Project updated', type: ProjectResponseDto })
  @ApiResponse({ status: 404, description: 'Project not found' })
  async updateProject(
    @Param('id') id: string,
    @Body() input: UpdateProjectDto,
  ) {
    return this.commandBus.execute(new UpdateProjectCommand(id, input));
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete project (soft delete)' })
  @ApiParam({ name: 'id', description: 'Project ID' })
  @ApiResponse({ status: 200, description: 'Project deleted', type: DeleteProjectResponseDto })
  @ApiResponse({ status: 404, description: 'Project not found' })
  async deleteProject(@Param('id') id: string) {
    return this.commandBus.execute(new DeleteProjectCommand(id));
  }
}
