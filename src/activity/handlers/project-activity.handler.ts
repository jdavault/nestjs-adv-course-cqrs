import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ActivityService } from '../activity.service';
import { ProjectCreatedEvent } from '../../projects/events/impl/project-created.event';
import { ProjectUpdatedEvent } from '../../projects/events/impl/project-updated.event';
import { ProjectDeletedEvent } from '../../projects/events/impl/project-deleted.event';
import { AggregateType, ActionType } from '../../common';

@EventsHandler(ProjectCreatedEvent)
export class ProjectCreatedActivityHandler
  implements IEventHandler<ProjectCreatedEvent>
{
  constructor(private readonly activityService: ActivityService) {}

  async handle(event: ProjectCreatedEvent) {
    await this.activityService.log({
      userId: event.userId,
      entityType: AggregateType.PROJECT,
      entityId: event.projectId,
      action: ActionType.CREATED,
      payload: {
        name: event.name,
        status: event.status,
        description: event.description,
        deadline: event.deadline,
      },
      timestamp: event.timestamp,
    });
  }
}

@EventsHandler(ProjectUpdatedEvent)
export class ProjectUpdatedActivityHandler
  implements IEventHandler<ProjectUpdatedEvent>
{
  constructor(private readonly activityService: ActivityService) {}

  async handle(event: ProjectUpdatedEvent) {
    await this.activityService.log({
      userId: event.userId,
      entityType: AggregateType.PROJECT,
      entityId: event.projectId,
      action: ActionType.UPDATED,
      payload: {
        changes: event.changes,
      },
      timestamp: event.timestamp,
    });
  }
}

@EventsHandler(ProjectDeletedEvent)
export class ProjectDeletedActivityHandler
  implements IEventHandler<ProjectDeletedEvent>
{
  constructor(private readonly activityService: ActivityService) {}

  async handle(event: ProjectDeletedEvent) {
    await this.activityService.log({
      userId: event.userId,
      entityType: AggregateType.PROJECT,
      entityId: event.projectId,
      action: ActionType.DELETED,
      payload: {},
      timestamp: event.timestamp,
    });
  }
}

// Export all handlers
export const ProjectActivityHandler = [
  ProjectCreatedActivityHandler,
  ProjectUpdatedActivityHandler,
  ProjectDeletedActivityHandler,
];
