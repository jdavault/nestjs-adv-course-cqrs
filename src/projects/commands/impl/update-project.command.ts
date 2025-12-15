import { ProjectStatus } from '../../project.entity';

export class UpdateProjectCommand {
  constructor(
    public readonly projectId: string,
    public readonly data: {
      name?: string;
      description?: string;
      status?: ProjectStatus;
      deadline?: Date;
    },
  ) {}
}
