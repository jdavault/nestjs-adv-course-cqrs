// commands/handlers/create-user.handler.ts
import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { CreateUserCommand } from '../impl/create-user.command';
import { UserRepository } from '../../repositories/user.repository';
import { v4 as uuidv4 } from 'uuid';
import { UserCreatedEvent } from '../../events/impl/user-created.event';
import { Users } from '../../users.entity';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    private readonly eventBus: EventBus,
    private readonly userRepository: UserRepository,
  ) {}

  async execute(command: CreateUserCommand) {
    console.log('📍 CreateUserHandler - Received command:', command);

    const { username, email, password } = command;

    try {
      // Create user entity
      const user = this.userRepository.create();
      const uuid = uuidv4();
      console.log('📍 Generated UUID:', uuid);

      user.userId = await this.convertStringToBinary(uuid);
      console.log('📍 Binary userId:', user.userId);

      user.username = username;
      user.email = email;
      user.password = password;

      console.log('📍 Before save - user object:', {
        userId: Buffer.from(user.userId).toString('hex'),
        username: user.username,
        email: user.email,
        password: user.password,
      });

      const userDB: Users = await this.userRepository.save(user);
      console.log('✅ After save - userDB:', {
        userId: Buffer.from(userDB.userId).toString('hex'),
        username: userDB.username,
        email: userDB.email,
      });

      // Send event
      this.sendEvent(userDB.userId, this.eventBus);

      // Return user with hex userId for response
      return {
        ...userDB,
        userId: Buffer.from(userDB.userId).toString('hex'),
      };
    } catch (error) {
      console.error('❌ Error in CreateUserHandler:', error);
      throw error;
    }
  }

  private async sendEvent(userId: Buffer, eventBus: EventBus) {
    if (userId !== undefined) {
      console.log('📤 Sending UserCreatedEvent');
      eventBus.publish(
        new UserCreatedEvent(Buffer.from(userId).toString('hex')),
      );
    }
  }

  private async convertStringToBinary(uuid: string): Promise<Buffer> {
    // Fix: UUID is 36 chars, but we need to remove dashes for binary storage
    const hex = uuid.replace(/-/g, '');
    return Buffer.from(hex, 'hex');
  }
}
