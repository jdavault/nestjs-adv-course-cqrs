import { ProjectStatus } from '../../project.entity';

export class ProjectCreatedEvent {
  constructor(
    public readonly projectId: string,
    public readonly userId: string,
    public readonly name: string,
    public readonly status: ProjectStatus,
    public readonly description?: string,
    public readonly deadline?: Date,
    public readonly timestamp: Date = new Date(),
  ) {}
}
