import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ActivityService } from '../activity.service';
import { TaskCreatedEvent } from '../../projects/tasks/events/impl/task-created.event';
import { TaskUpdatedEvent } from '../../projects/tasks/events/impl/task-updated.event';
import { TaskDeletedEvent } from '../../projects/tasks/events/impl/task-deleted.event';
import { AggregateType, ActionType } from '../../common';

@EventsHandler(TaskCreatedEvent)
export class TaskCreatedActivityHandler
  implements IEventHandler<TaskCreatedEvent>
{
  constructor(private readonly activityService: ActivityService) {}

  async handle(event: TaskCreatedEvent) {
    await this.activityService.log({
      userId: event.assigneeId || 'system',
      entityType: AggregateType.TASK,
      entityId: event.taskId,
      action: ActionType.CREATED,
      payload: {
        projectId: event.projectId,
        title: event.title,
        status: event.status,
        priority: event.priority,
        assigneeId: event.assigneeId,
        description: event.description,
        dueDate: event.dueDate,
      },
      timestamp: event.timestamp,
    });
  }
}

@EventsHandler(TaskUpdatedEvent)
export class TaskUpdatedActivityHandler
  implements IEventHandler<TaskUpdatedEvent>
{
  constructor(private readonly activityService: ActivityService) {}

  async handle(event: TaskUpdatedEvent) {
    // Determine the action type
    let action = ActionType.UPDATED;
    if (event.changes.status) {
      action = ActionType.STATUS_CHANGED;
    } else if (event.changes.assigneeId !== undefined) {
      action = event.changes.assigneeId
        ? ActionType.ASSIGNED
        : ActionType.UNASSIGNED;
    }

    await this.activityService.log({
      userId: event.changes.assigneeId || 'system',
      entityType: AggregateType.TASK,
      entityId: event.taskId,
      action,
      payload: {
        projectId: event.projectId,
        changes: event.changes,
      },
      timestamp: event.timestamp,
    });
  }
}

@EventsHandler(TaskDeletedEvent)
export class TaskDeletedActivityHandler
  implements IEventHandler<TaskDeletedEvent>
{
  constructor(private readonly activityService: ActivityService) {}

  async handle(event: TaskDeletedEvent) {
    await this.activityService.log({
      userId: 'system',
      entityType: AggregateType.TASK,
      entityId: event.taskId,
      action: ActionType.DELETED,
      payload: {
        projectId: event.projectId,
      },
      timestamp: event.timestamp,
    });
  }
}

// Export all handlers
export const TaskActivityHandler = [
  TaskCreatedActivityHandler,
  TaskUpdatedActivityHandler,
  TaskDeletedActivityHandler,
];
