# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build and Development Commands

```bash
# Development
npm run start:dev      # Start with hot-reload (watch mode)
npm run start:debug    # Start with debugger attached

# Build & Production
npm run build          # Build the project (runs prebuild to clean dist/)
npm run start:prod     # Run production build from dist/

# Code Quality
npm run lint           # Lint and auto-fix TypeScript files
npm run format         # Format code with Prettier

# Testing
npm run test           # Run unit tests
npm run test:watch     # Run tests in watch mode
npm run test:cov       # Run tests with coverage report
npm run test:e2e       # Run end-to-end tests

# Infrastructure
docker-compose up      # Start PostgreSQL and MongoDB databases
```

## Architecture Overview

NestJS application demonstrating CQRS (Command Query Responsibility Segregation) pattern with:
- **PostgreSQL** (TypeORM) - Users, Projects, Tasks
- **MongoDB** (Mongoose) - Activity logging
- **Dual API**: REST (Swagger at `/api`) + GraphQL (Playground at `/graphql`)

### Feature Modules

| Module | Description | Database |
|--------|-------------|----------|
| `users/` | User management with full CQRS | PostgreSQL |
| `projects/` | Project management with nested Tasks sub-module | PostgreSQL |
| `activity/` | Event listener that logs all domain events | MongoDB |
| `common/` | AggregateRoot base class and interfaces | - |

### CQRS Pattern Structure

Each feature module follows this structure:
```
src/{feature}/
├── commands/
│   ├── impl/           # Command definitions (CreateUserCommand, etc.)
│   └── handlers/       # Execute business logic, publish events
├── queries/
│   ├── impl/           # Query definitions (GetUserQuery, GetAllUsersQuery)
│   └── handlers/       # Read-only operations from repository
├── events/
│   └── impl/           # Domain events (UserCreatedEvent, etc.)
├── sagas/              # RxJS orchestrators for complex workflows
├── repositories/       # Custom TypeORM repositories
├── graphql/            # Resolvers, types, inputs
├── dto/                # REST DTOs with Swagger decorators
├── {feature}.entity.ts
├── {feature}.controller.ts
└── {feature}.module.ts
```

### Key Patterns

**Commands** - Write operations that modify state:
```typescript
// Controller dispatches command
await this.commandBus.execute(new CreateUserCommand(username, email, password));

// Handler executes and publishes event
@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  async execute(command: CreateUserCommand) {
    const user = await this.repository.save(entity);
    this.eventBus.publish(new UserCreatedEvent(user.id));
    return user;
  }
}
```

**Queries** - Read-only operations:
```typescript
await this.queryBus.execute(new GetUserQuery(userId));
```

**Module Registration** - Handlers exported as arrays:
```typescript
export const CommandHandlers = [CreateUserHandler, UpdateUserHandler, DeleteUserHandler];
export const QueryHandlers = [GetUserHandler, GetAllUsersHandler];

@Module({
  providers: [...CommandHandlers, ...QueryHandlers, UsersSagas, UserRepository],
})
```

**Sagas** - Cross-cutting workflows with RxJS:
```typescript
@Saga()
userCreated$ = (events$: Observable<any>) =>
  events$.pipe(
    ofType(UserCreatedEvent),
    map((event) => new SendWelcomeEmailCommand(event.userId))
  );
```

### Database Configuration

**PostgreSQL** (TypeORM):
- Config: `src/config/typeorm.config.service.ts`
- Entity auto-discovery: `entities: [__dirname + '/../**/*.entity{.ts,.js}']`
- UUID stored as bytea with custom transformer

**MongoDB** (Mongoose):
- Connection string via `MONGODB_URI` env var
- Activity schema in `src/activity/schemas/`

**Environment Variables** (`.env`):
```
TYPEORM_HOST, TYPEORM_PORT, TYPEORM_USERNAME, TYPEORM_PASSWORD, TYPEORM_DATABASE
MONGODB_URI=mongodb://mongo:mongo@localhost:27017/activity-db?authSource=admin
```

### Entity Patterns

- UUID primary keys with bytea storage transformer
- Soft deletes via `@DeleteDateColumn()`
- Optimistic locking via `@VersionColumn()`
- Timestamps: `@CreateDateColumn()`, `@UpdateDateColumn()`
