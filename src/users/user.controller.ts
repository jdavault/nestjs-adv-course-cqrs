import { Get, Post, Delete, Param, Controller, Body } from '@nestjs/common';
import { Request } from 'express';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateUserCommand } from './commands/impl/create-user.command';

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

  @Get(':id')
  public async getUser(@Param('id') id: string) {
    // You'll need to create GetUserQuery
    return await this.queryBus.execute(new GetUserQuery(id));
  }

  @Put(':id')
  public async updateUser(
    @Param('id') id: string,
    @Body() input: UpdateUserDto,
  ) {
    // You'll need to create UpdateUserCommand
    return await this.commandBus.execute(new UpdateUserCommand(id, input));
  }
}
