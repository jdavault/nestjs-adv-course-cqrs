import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { DeleteProjectCommand } from '../impl/delete-project.command';
import { ProjectRepository } from '../../repositories/project.repository';
import { ProjectDeletedEvent } from '../../events/impl/project-deleted.event';
import { NotFoundException } from '@nestjs/common';

@CommandHandler(DeleteProjectCommand)
export class DeleteProjectHandler
  implements ICommandHandler<DeleteProjectCommand>
{
  constructor(
    private readonly projectRepository: ProjectRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: DeleteProjectCommand) {
    const { projectId } = command;

    const project = await this.projectRepository.findOne({
      where: { projectId },
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${projectId} not found`);
    }

    // Soft delete
    await this.projectRepository.softRemove(project);

    this.eventBus.publish(
      new ProjectDeletedEvent(projectId, project.userId),
    );

    return { deleted: true, projectId };
  }
}
