import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetProjectsByUserQuery } from '../impl/get-projects-by-user.query';
import { ProjectRepository } from '../../repositories/project.repository';

@QueryHandler(GetProjectsByUserQuery)
export class GetProjectsByUserHandler
  implements IQueryHandler<GetProjectsByUserQuery>
{
  constructor(private readonly projectRepository: ProjectRepository) {}

  async execute(query: GetProjectsByUserQuery) {
    const { userId } = query;

    return this.projectRepository.find({
      where: { userId },
    });
  }
}
