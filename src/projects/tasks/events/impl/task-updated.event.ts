import { TaskStatus, TaskPriority } from '../../task.entity';

export class TaskUpdatedEvent {
  constructor(
    public readonly taskId: string,
    public readonly projectId: string,
    public readonly changes: {
      title?: string;
      description?: string;
      assigneeId?: string;
      status?: TaskStatus;
      priority?: TaskPriority;
      dueDate?: Date;
    },
    public readonly timestamp: Date = new Date(),
  ) {}
}
