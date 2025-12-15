import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllProjectsQuery } from '../impl/get-all-projects.query';
import { ProjectRepository } from '../../repositories/project.repository';

@QueryHandler(GetAllProjectsQuery)
export class GetAllProjectsHandler
  implements IQueryHandler<GetAllProjectsQuery>
{
  constructor(private readonly projectRepository: ProjectRepository) {}

  async execute(_query: GetAllProjectsQuery) {
    return this.projectRepository.find();
  }
}
