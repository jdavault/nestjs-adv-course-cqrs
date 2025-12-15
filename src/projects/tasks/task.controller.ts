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
import { CreateTaskCommand } from './commands/impl/create-task.command';
import { UpdateTaskCommand } from './commands/impl/update-task.command';
import { DeleteTaskCommand } from './commands/impl/delete-task.command';
import { GetTaskQuery } from './queries/impl/get-task.query';
import { GetTasksByProjectQuery } from './queries/impl/get-tasks-by-project.query';
import { GetTasksByAssigneeQuery } from './queries/impl/get-tasks-by-assignee.query';
import {
  CreateTaskDto,
  UpdateTaskDto,
  TaskResponseDto,
  DeleteTaskResponseDto,
} from './dto/task.dto';

@ApiTags('tasks')
@Controller('projects/:projectId/tasks')
export class TaskController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new task in a project' })
  @ApiParam({ name: 'projectId', description: 'Project ID' })
  @ApiBody({ type: CreateTaskDto })
  @ApiResponse({ status: 201, description: 'Task created', type: TaskResponseDto })
  async createTask(
    @Param('projectId') projectId: string,
    @Body() input: CreateTaskDto,
  ) {
    return this.commandBus.execute(
      new CreateTaskCommand(
        projectId,
        input.title,
        input.description,
        input.assigneeId,
        input.status,
        input.priority,
        input.dueDate,
      ),
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get all tasks in a project' })
  @ApiParam({ name: 'projectId', description: 'Project ID' })
  @ApiResponse({ status: 200, description: 'List of tasks', type: [TaskResponseDto] })
  async getTasksByProject(@Param('projectId') projectId: string) {
    return this.queryBus.execute(new GetTasksByProjectQuery(projectId));
  }

  @Get('assignee/:assigneeId')
  @ApiOperation({ summary: 'Get tasks by assignee (across all projects)' })
  @ApiParam({ name: 'projectId', description: 'Project ID (ignored for this query)' })
  @ApiParam({ name: 'assigneeId', description: 'Assignee user ID' })
  @ApiResponse({ status: 200, description: 'List of tasks', type: [TaskResponseDto] })
  async getTasksByAssignee(@Param('assigneeId') assigneeId: string) {
    return this.queryBus.execute(new GetTasksByAssigneeQuery(assigneeId));
  }

  @Get(':taskId')
  @ApiOperation({ summary: 'Get task by ID' })
  @ApiParam({ name: 'projectId', description: 'Project ID' })
  @ApiParam({ name: 'taskId', description: 'Task ID' })
  @ApiResponse({ status: 200, description: 'Task found', type: TaskResponseDto })
  @ApiResponse({ status: 404, description: 'Task not found' })
  async getTask(@Param('taskId') taskId: string) {
    return this.queryBus.execute(new GetTaskQuery(taskId));
  }

  @Put(':taskId')
  @ApiOperation({ summary: 'Update task' })
  @ApiParam({ name: 'projectId', description: 'Project ID' })
  @ApiParam({ name: 'taskId', description: 'Task ID' })
  @ApiBody({ type: UpdateTaskDto })
  @ApiResponse({ status: 200, description: 'Task updated', type: TaskResponseDto })
  @ApiResponse({ status: 404, description: 'Task not found' })
  async updateTask(
    @Param('taskId') taskId: string,
    @Body() input: UpdateTaskDto,
  ) {
    return this.commandBus.execute(new UpdateTaskCommand(taskId, input));
  }

  @Delete(':taskId')
  @ApiOperation({ summary: 'Delete task (soft delete)' })
  @ApiParam({ name: 'projectId', description: 'Project ID' })
  @ApiParam({ name: 'taskId', description: 'Task ID' })
  @ApiResponse({ status: 200, description: 'Task deleted', type: DeleteTaskResponseDto })
  @ApiResponse({ status: 404, description: 'Task not found' })
  async deleteTask(@Param('taskId') taskId: string) {
    return this.commandBus.execute(new DeleteTaskCommand(taskId));
  }
}
