import { ProjectStatus } from '../../project.entity';

export class CreateProjectCommand {
  constructor(
    public readonly userId: string,
    public readonly name: string,
    public readonly description?: string,
    public readonly status?: ProjectStatus,
    public readonly deadline?: Date,
  ) {}
}
