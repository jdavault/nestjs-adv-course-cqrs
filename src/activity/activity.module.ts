import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CqrsModule } from '@nestjs/cqrs';
import { ActivityLog, ActivityLogSchema } from './schemas/activity-log.schema';
import { ActivityService } from './activity.service';
import { ActivityController } from './activity.controller';
import { ActivityResolver } from './graphql/activity.resolver';

// Event Handlers for logging
import { ProjectActivityHandler } from './handlers/project-activity.handler';
import { TaskActivityHandler } from './handlers/task-activity.handler';
import { UserActivityHandler } from './handlers/user-activity.handler';

@Module({
  imports: [
    CqrsModule,
    MongooseModule.forFeature([
      { name: ActivityLog.name, schema: ActivityLogSchema },
    ]),
  ],
  controllers: [ActivityController],
  providers: [
    ActivityService,
    ActivityResolver,
    ...ProjectActivityHandler,
    ...TaskActivityHandler,
    UserActivityHandler,
  ],
  exports: [ActivityService],
})
export class ActivityModule {}
