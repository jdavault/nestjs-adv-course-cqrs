import { ProjectStatus } from '../../project.entity';

export class ProjectUpdatedEvent {
  constructor(
    public readonly projectId: string,
    public readonly userId: string,
    public readonly changes: {
      name?: string;
      description?: string;
      status?: ProjectStatus;
      deadline?: Date;
    },
    public readonly timestamp: Date = new Date(),
  ) {}
}
