import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetTasksByProjectQuery } from '../impl/get-tasks-by-project.query';
import { TaskRepository } from '../../repositories/task.repository';

@QueryHandler(GetTasksByProjectQuery)
export class GetTasksByProjectHandler
  implements IQueryHandler<GetTasksByProjectQuery>
{
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(query: GetTasksByProjectQuery) {
    const { projectId } = query;

    return this.taskRepository.find({
      where: { projectId },
    });
  }
}
