import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './repositories/user.repository';
import { CreateUserHandler } from './commands/handlers/create-user.handler';
import { UpdateUserHandler } from './commands/handlers/update-user.handler';
import { DeleteUserHandler } from './commands/handlers/delete-user.handler';
import { GetUserHandler } from './queries/handlers/get-user.handler';
import { GetAllUsersHandler } from './queries/handlers/get-all-users.handler';
import { UserCreatedEvent } from './events/impl/user-created.event';
import { UsersSagas } from './sagas/users.saga';
import { UserController } from './user.controller';
import { Users } from './users.entity';

export const CommandHandlers = [CreateUserHandler, UpdateUserHandler, DeleteUserHandler];
export const QueryHandlers = [GetUserHandler, GetAllUsersHandler];
export const EventHandlers = [UserCreatedEvent];
@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([Users])],
  controllers: [UserController],
  providers: [
    UserRepository,
    ...CommandHandlers,
    ...QueryHandlers,
    ...EventHandlers,
    UsersSagas,
  ],
  exports: [UserRepository],
})
export class UsersModule {}
