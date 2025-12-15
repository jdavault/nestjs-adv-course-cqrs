import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { UpdateProjectCommand } from '../impl/update-project.command';
import { ProjectRepository } from '../../repositories/project.repository';
import { ProjectUpdatedEvent } from '../../events/impl/project-updated.event';
import { NotFoundException } from '@nestjs/common';

@CommandHandler(UpdateProjectCommand)
export class UpdateProjectHandler
  implements ICommandHandler<UpdateProjectCommand>
{
  constructor(
    private readonly projectRepository: ProjectRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: UpdateProjectCommand) {
    const { projectId, data } = command;

    const project = await this.projectRepository.findOne({
      where: { projectId },
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${projectId} not found`);
    }

    Object.assign(project, data);

    const updatedProject = await this.projectRepository.save(project);

    this.eventBus.publish(
      new ProjectUpdatedEvent(
        updatedProject.projectId,
        updatedProject.userId,
        data,
      ),
    );

    return updatedProject;
  }
}
