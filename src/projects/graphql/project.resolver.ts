import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ProjectType, DeleteProjectResponse } from './project.type';
import { CreateProjectInput, UpdateProjectInput } from './project.input';
import { CreateProjectCommand } from '../commands/impl/create-project.command';
import { UpdateProjectCommand } from '../commands/impl/update-project.command';
import { DeleteProjectCommand } from '../commands/impl/delete-project.command';
import { GetProjectQuery } from '../queries/impl/get-project.query';
import { GetAllProjectsQuery } from '../queries/impl/get-all-projects.query';
import { GetProjectsByUserQuery } from '../queries/impl/get-projects-by-user.query';

@Resolver(() => ProjectType)
export class ProjectResolver {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Query(() => [ProjectType], { name: 'projects' })
  async getAllProjects(): Promise<ProjectType[]> {
    return this.queryBus.execute(new GetAllProjectsQuery());
  }

  @Query(() => ProjectType, { name: 'project' })
  async getProject(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<ProjectType> {
    return this.queryBus.execute(new GetProjectQuery(id));
  }

  @Query(() => [ProjectType], { name: 'projectsByUser' })
  async getProjectsByUser(
    @Args('userId', { type: () => ID }) userId: string,
  ): Promise<ProjectType[]> {
    return this.queryBus.execute(new GetProjectsByUserQuery(userId));
  }

  @Mutation(() => ProjectType)
  async createProject(
    @Args('input') input: CreateProjectInput,
  ): Promise<ProjectType> {
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

  @Mutation(() => ProjectType)
  async updateProject(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdateProjectInput,
  ): Promise<ProjectType> {
    return this.commandBus.execute(new UpdateProjectCommand(id, input));
  }

  @Mutation(() => DeleteProjectResponse)
  async deleteProject(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<DeleteProjectResponse> {
    return this.commandBus.execute(new DeleteProjectCommand(id));
  }
}
