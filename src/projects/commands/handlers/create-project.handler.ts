import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { CreateProjectCommand } from '../impl/create-project.command';
import { ProjectRepository } from '../../repositories/project.repository';
import { ProjectCreatedEvent } from '../../events/impl/project-created.event';
import { ProjectStatus } from '../../project.entity';
import { v4 as uuidv4 } from 'uuid';

@CommandHandler(CreateProjectCommand)
export class CreateProjectHandler
  implements ICommandHandler<CreateProjectCommand>
{
  constructor(
    private readonly projectRepository: ProjectRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: CreateProjectCommand) {
    const { userId, name, description, status, deadline } = command;

    const project = this.projectRepository.create({
      projectId: uuidv4().replace(/-/g, ''),
      userId,
      name,
      description,
      status: status || ProjectStatus.DRAFT,
      deadline,
    });

    const savedProject = await this.projectRepository.save(project);

    this.eventBus.publish(
      new ProjectCreatedEvent(
        savedProject.projectId,
        savedProject.userId,
        savedProject.name,
        savedProject.status,
        savedProject.description,
        savedProject.deadline,
      ),
    );

    return savedProject;
  }
}
