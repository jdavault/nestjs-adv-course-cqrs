import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './project.entity';
import { ProjectRepository } from './repositories/project.repository';
import { ProjectController } from './project.controller';
import { ProjectResolver } from './graphql/project.resolver';

// Command Handlers
import { CreateProjectHandler } from './commands/handlers/create-project.handler';
import { UpdateProjectHandler } from './commands/handlers/update-project.handler';
import { DeleteProjectHandler } from './commands/handlers/delete-project.handler';

// Query Handlers
import { GetProjectHandler } from './queries/handlers/get-project.handler';
import { GetAllProjectsHandler } from './queries/handlers/get-all-projects.handler';
import { GetProjectsByUserHandler } from './queries/handlers/get-projects-by-user.handler';

// Tasks (nested)
import { Task } from './tasks/task.entity';
import { TaskRepository } from './tasks/repositories/task.repository';
import { TaskController } from './tasks/task.controller';
import { TaskResolver } from './tasks/graphql/task.resolver';
import { CreateTaskHandler } from './tasks/commands/handlers/create-task.handler';
import { UpdateTaskHandler } from './tasks/commands/handlers/update-task.handler';
import { DeleteTaskHandler } from './tasks/commands/handlers/delete-task.handler';
import { GetTaskHandler } from './tasks/queries/handlers/get-task.handler';
import { GetTasksByProjectHandler } from './tasks/queries/handlers/get-tasks-by-project.handler';
import { GetTasksByAssigneeHandler } from './tasks/queries/handlers/get-tasks-by-assignee.handler';

const ProjectCommandHandlers = [
  CreateProjectHandler,
  UpdateProjectHandler,
  DeleteProjectHandler,
];

const ProjectQueryHandlers = [
  GetProjectHandler,
  GetAllProjectsHandler,
  GetProjectsByUserHandler,
];

const TaskCommandHandlers = [
  CreateTaskHandler,
  UpdateTaskHandler,
  DeleteTaskHandler,
];

const TaskQueryHandlers = [
  GetTaskHandler,
  GetTasksByProjectHandler,
  GetTasksByAssigneeHandler,
];

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([Project, Task])],
  controllers: [ProjectController, TaskController],
  providers: [
    ProjectRepository,
    TaskRepository,
    ProjectResolver,
    TaskResolver,
    ...ProjectCommandHandlers,
    ...ProjectQueryHandlers,
    ...TaskCommandHandlers,
    ...TaskQueryHandlers,
  ],
  exports: [ProjectRepository, TaskRepository],
})
export class ProjectsModule {}
