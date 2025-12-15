import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ActivityService } from '../activity.service';
import { UserCreatedEvent } from '../../users/events/impl/user-created.event';
import { AggregateType, ActionType } from '../../common';

@EventsHandler(UserCreatedEvent)
export class UserCreatedActivityHandler
  implements IEventHandler<UserCreatedEvent>
{
  constructor(private readonly activityService: ActivityService) {}

  async handle(event: UserCreatedEvent) {
    await this.activityService.log({
      userId: event.userId,
      entityType: AggregateType.USER,
      entityId: event.userId,
      action: ActionType.CREATED,
      payload: {},
      timestamp: new Date(),
    });
  }
}

// Export handler
export const UserActivityHandler = UserCreatedActivityHandler;
