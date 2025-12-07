import { Get, Post, Put, Delete, Param, Controller, Body } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateUserCommand } from './commands/impl/create-user.command';
import { UpdateUserCommand } from './commands/impl/update-user.command';
import { DeleteUserCommand } from './commands/impl/delete-user.command';
import { GetUserQuery } from './queries/impl/get-user.query';
import { GetAllUsersQuery } from './queries/impl/get-all-users.query';
import {
  UserResponse,
  DeleteUserResponse,
  ErrorResponse,
} from '../swagger/responses';
import { SignUpDto, UpdateUserDto } from './dto/user.dto';

@ApiTags('users')
@Controller('profiles')
export class UserController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post('signup')
  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({ type: SignUpDto })
  @ApiResponse({ status: 201, description: 'User created', type: UserResponse })
  @ApiResponse({ status: 400, description: 'Bad request', type: ErrorResponse })
  public async signup(@Body() input: SignUpDto) {
    return this.commandBus.execute(
      new CreateUserCommand(input.username, input.email, input.password),
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'List of users',
    type: [UserResponse],
  })
  public async getAllUsers() {
    return this.queryBus.execute(new GetAllUsersQuery());
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({ name: 'id', description: 'User ID (hex string)' })
  @ApiResponse({ status: 200, description: 'User found', type: UserResponse })
  @ApiResponse({ status: 404, description: 'User not found', type: ErrorResponse })
  public async getUser(@Param('id') id: string) {
    return this.queryBus.execute(new GetUserQuery(id));
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update user by ID' })
  @ApiParam({ name: 'id', description: 'User ID (hex string)' })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ status: 200, description: 'User updated', type: UserResponse })
  @ApiResponse({ status: 404, description: 'User not found', type: ErrorResponse })
  public async updateUser(
    @Param('id') id: string,
    @Body() input: UpdateUserDto,
  ) {
    return this.commandBus.execute(new UpdateUserCommand(id, input));
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user by ID' })
  @ApiParam({ name: 'id', description: 'User ID (hex string)' })
  @ApiResponse({
    status: 200,
    description: 'User deleted',
    type: DeleteUserResponse,
  })
  @ApiResponse({ status: 404, description: 'User not found', type: ErrorResponse })
  public async deleteUser(@Param('id') id: string) {
    return this.commandBus.execute(new DeleteUserCommand(id));
  }
}
