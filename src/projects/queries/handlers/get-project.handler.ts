import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetProjectQuery } from '../impl/get-project.query';
import { ProjectRepository } from '../../repositories/project.repository';
import { NotFoundException } from '@nestjs/common';

@QueryHandler(GetProjectQuery)
export class GetProjectHandler implements IQueryHandler<GetProjectQuery> {
  constructor(private readonly projectRepository: ProjectRepository) {}

  async execute(query: GetProjectQuery) {
    const { projectId } = query;

    const project = await this.projectRepository.findOne({
      where: { projectId },
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${projectId} not found`);
    }

    return project;
  }
}
