import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { TaskType, DeleteTaskResponse } from './task.type';
import { CreateTaskInput, UpdateTaskInput } from './task.input';
import { CreateTaskCommand } from '../commands/impl/create-task.command';
import { UpdateTaskCommand } from '../commands/impl/update-task.command';
import { DeleteTaskCommand } from '../commands/impl/delete-task.command';
import { GetTaskQuery } from '../queries/impl/get-task.query';
import { GetTasksByProjectQuery } from '../queries/impl/get-tasks-by-project.query';
import { GetTasksByAssigneeQuery } from '../queries/impl/get-tasks-by-assignee.query';

@Resolver(() => TaskType)
export class TaskResolver {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Query(() => TaskType, { name: 'task' })
  async getTask(@Args('id', { type: () => ID }) id: string): Promise<TaskType> {
    return this.queryBus.execute(new GetTaskQuery(id));
  }

  @Query(() => [TaskType], { name: 'tasksByProject' })
  async getTasksByProject(
    @Args('projectId', { type: () => ID }) projectId: string,
  ): Promise<TaskType[]> {
    return this.queryBus.execute(new GetTasksByProjectQuery(projectId));
  }

  @Query(() => [TaskType], { name: 'tasksByAssignee' })
  async getTasksByAssignee(
    @Args('assigneeId', { type: () => ID }) assigneeId: string,
  ): Promise<TaskType[]> {
    return this.queryBus.execute(new GetTasksByAssigneeQuery(assigneeId));
  }

  @Mutation(() => TaskType)
  async createTask(@Args('input') input: CreateTaskInput): Promise<TaskType> {
    return this.commandBus.execute(
      new CreateTaskCommand(
        input.projectId,
        input.title,
        input.description,
        input.assigneeId,
        input.status,
        input.priority,
        input.dueDate,
      ),
    );
  }

  @Mutation(() => TaskType)
  async updateTask(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdateTaskInput,
  ): Promise<TaskType> {
    return this.commandBus.execute(new UpdateTaskCommand(id, input));
  }

  @Mutation(() => DeleteTaskResponse)
  async deleteTask(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<DeleteTaskResponse> {
    return this.commandBus.execute(new DeleteTaskCommand(id));
  }
}
