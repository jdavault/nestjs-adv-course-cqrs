import { Get, Post, Put, Delete, Param, Controller, Body } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateUserCommand } from './commands/impl/create-user.command';
import { UpdateUserCommand } from './commands/impl/update-user.command';
import { DeleteUserCommand } from './commands/impl/delete-user.command';
import { GetUserQuery } from './queries/impl/get-user.query';
import { GetAllUsersQuery } from './queries/impl/get-all-users.query';

export class SignUpDto {
  email: string;
  username: string;
  password: string;
}

export class UpdateUserDto {
  email?: string;
  username?: string;
  password?: string;
}

@Controller('profiles')
export class UserController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post('signup')
  public async signup(@Body() input: SignUpDto) {
    try {
      const result = await this.commandBus.execute(
        new CreateUserCommand(input.username, input.email, input.password),
      );
      console.log('User created:', result);
      return result;
    } catch (errors) {
      console.log('Error creating user: ', errors);
      throw errors;
    }
  }

  @Get()
  public async getAllUsers() {
    return await this.queryBus.execute(new GetAllUsersQuery());
  }

  @Get(':id')
  public async getUser(@Param('id') id: string) {
    return await this.queryBus.execute(new GetUserQuery(id));
  }

  @Put(':id')
  public async updateUser(
    @Param('id') id: string,
    @Body() input: UpdateUserDto,
  ) {
    return await this.commandBus.execute(new UpdateUserCommand(id, input));
  }

  @Delete(':id')
  public async deleteUser(@Param('id') id: string) {
    return await this.commandBus.execute(new DeleteUserCommand(id));
  }
}
