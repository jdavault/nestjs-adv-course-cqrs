# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build and Development Commands

```bash
npm run build          # Build the project (runs prebuild to clean dist/)
npm run start          # Start the application
npm run start:dev      # Start with hot-reload (watch mode)
npm run start:debug    # Start with debugger attached
npm run start:prod     # Run production build from dist/

npm run lint           # Lint and auto-fix TypeScript files
npm run format         # Format code with Prettier

npm run test           # Run unit tests
npm run test:watch     # Run tests in watch mode
npm run test:cov       # Run tests with coverage report
npm run test:e2e       # Run end-to-end tests
```

## Architecture Overview

This is a NestJS application demonstrating the CQRS (Command Query Responsibility Segregation) pattern with TypeORM and MySQL.

### CQRS Pattern Structure

The application follows a strict CQRS architecture with commands, events, and sagas:

```
src/users/
├── commands/
│   ├── impl/           # Command definitions (e.g., CreateUserCommand)
│   └── handlers/       # Command handlers that execute business logic
├── events/
│   ├── impl/           # Event definitions (e.g., UserCreatedEvent)
│   └── handlers/       # Event handlers that react to domain events
├── sagas/              # Saga orchestrators for cross-cutting workflows
├── repositories/       # TypeORM custom repositories
└── users.entity.ts     # TypeORM entity definitions
```

### Key Patterns

- **Commands**: Classes in `commands/impl/` define operations (e.g., `CreateUserCommand`)
- **Command Handlers**: Use `@CommandHandler()` decorator, implement `ICommandHandler<T>`
- **Events**: Published via `EventBus.publish()` after command execution
- **Event Handlers**: Use `@EventsHandler()` decorator for side effects
- **Sagas**: Use `@Saga()` decorator with RxJS operators for complex workflows

### Module Registration

In feature modules (e.g., `users.module.ts`), handlers are exported as arrays and spread into providers:
```typescript
export const CommandHandlers = [CreateUserHandler];
export const EventHandlers = [UserCreatedEvent];
providers: [...CommandHandlers, ...EventHandlers, UsersSagas]
```

### Database Configuration

- TypeORM with MySQL configured via environment variables
- Configuration in `src/config/typeorm.config.service.ts`
- Required env vars: `TYPEORM_HOST`, `TYPEORM_PORT`, `TYPEORM_USERNAME`, `TYPEORM_PASSWORD`, `TYPEORM_DATABASE`
- Entity auto-discovery pattern: `entities: [__dirname + '/../**/*.entity{.ts,.js}']`

### Controller Pattern

Controllers inject `CommandBus` and dispatch commands:
```typescript
constructor(private readonly commandBus: CommandBus) {}
return await this.commandBus.execute(new CreateUserCommand(...));
```