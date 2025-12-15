import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetTaskQuery } from '../impl/get-task.query';
import { TaskRepository } from '../../repositories/task.repository';
import { NotFoundException } from '@nestjs/common';

@QueryHandler(GetTaskQuery)
export class GetTaskHandler implements IQueryHandler<GetTaskQuery> {
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(query: GetTaskQuery) {
    const { taskId } = query;

    const task = await this.taskRepository.findOne({
      where: { taskId },
    });

    if (!task) {
      throw new NotFoundException(`Task with ID ${taskId} not found`);
    }

    return task;
  }
}
