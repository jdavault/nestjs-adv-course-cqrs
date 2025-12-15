import { TaskStatus, TaskPriority } from '../../task.entity';

export class TaskCreatedEvent {
  constructor(
    public readonly taskId: string,
    public readonly projectId: string,
    public readonly title: string,
    public readonly status: TaskStatus,
    public readonly priority: TaskPriority,
    public readonly assigneeId?: string,
    public readonly description?: string,
    public readonly dueDate?: Date,
    public readonly timestamp: Date = new Date(),
  ) {}
}
