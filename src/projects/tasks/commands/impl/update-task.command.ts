import { TaskStatus, TaskPriority } from '../../task.entity';

export class UpdateTaskCommand {
  constructor(
    public readonly taskId: string,
    public readonly data: {
      title?: string;
      description?: string;
      assigneeId?: string;
      status?: TaskStatus;
      priority?: TaskPriority;
      dueDate?: Date;
    },
  ) {}
}
