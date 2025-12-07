import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { UserType, DeleteUserResponse } from './user.type';
import { CreateUserInput, UpdateUserInput } from './user.input';
import { CreateUserCommand } from '../commands/impl/create-user.command';
import { UpdateUserCommand } from '../commands/impl/update-user.command';
import { DeleteUserCommand } from '../commands/impl/delete-user.command';
import { GetUserQuery } from '../queries/impl/get-user.query';
import { GetAllUsersQuery } from '../queries/impl/get-all-users.query';

@Resolver(() => UserType)
export class UserResolver {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Query(() => [UserType], { name: 'users' })
  async getAllUsers(): Promise<UserType[]> {
    return this.queryBus.execute(new GetAllUsersQuery());
  }

  @Query(() => UserType, { name: 'user' })
  async getUser(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<UserType> {
    return this.queryBus.execute(new GetUserQuery(id));
  }

  @Mutation(() => UserType)
  async createUser(
    @Args('input') input: CreateUserInput,
  ): Promise<UserType> {
    return this.commandBus.execute(
      new CreateUserCommand(input.username, input.email, input.password),
    );
  }

  @Mutation(() => UserType)
  async updateUser(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdateUserInput,
  ): Promise<UserType> {
    return this.commandBus.execute(new UpdateUserCommand(id, input));
  }

  @Mutation(() => DeleteUserResponse)
  async deleteUser(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<DeleteUserResponse> {
    return this.commandBus.execute(new DeleteUserCommand(id));
  }
}
