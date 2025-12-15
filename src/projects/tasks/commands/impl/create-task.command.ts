import { TaskStatus, TaskPriority } from '../../task.entity';

export class CreateTaskCommand {
  constructor(
    public readonly projectId: string,
    public readonly title: string,
    public readonly description?: string,
    public readonly assigneeId?: string,
    public readonly status?: TaskStatus,
    public readonly priority?: TaskPriority,
    public readonly dueDate?: Date,
  ) {}
}
