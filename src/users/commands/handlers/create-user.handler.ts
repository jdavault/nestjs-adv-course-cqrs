import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { CreateUserCommand } from '../impl/create-user.command';
import { UserRepository } from '../../repositories/user.repository';
import { v4 as uuidv4 } from 'uuid';
import { UserCreatedEvent } from '../../events/impl/user-created.event';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: CreateUserCommand) {
    const { username, email, password } = command;

    const user = this.userRepository.create({
      userId: uuidv4().replace(/-/g, ''),
      username,
      email,
      password,
    });

    const userDB = await this.userRepository.save(user);

    this.eventBus.publish(new UserCreatedEvent(userDB.userId));

    return userDB;
  }
}
