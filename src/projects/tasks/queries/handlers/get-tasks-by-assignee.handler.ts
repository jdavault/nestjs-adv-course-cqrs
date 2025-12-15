import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetTasksByAssigneeQuery } from '../impl/get-tasks-by-assignee.query';
import { TaskRepository } from '../../repositories/task.repository';

@QueryHandler(GetTasksByAssigneeQuery)
export class GetTasksByAssigneeHandler
  implements IQueryHandler<GetTasksByAssigneeQuery>
{
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(query: GetTasksByAssigneeQuery) {
    const { assigneeId } = query;

    return this.taskRepository.find({
      where: { assigneeId },
    });
  }
}
