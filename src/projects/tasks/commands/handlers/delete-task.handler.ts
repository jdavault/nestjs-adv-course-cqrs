import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { DeleteTaskCommand } from '../impl/delete-task.command';
import { TaskRepository } from '../../repositories/task.repository';
import { TaskDeletedEvent } from '../../events/impl/task-deleted.event';
import { NotFoundException } from '@nestjs/common';

@CommandHandler(DeleteTaskCommand)
export class DeleteTaskHandler implements ICommandHandler<DeleteTaskCommand> {
  constructor(
    private readonly taskRepository: TaskRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: DeleteTaskCommand) {
    const { taskId } = command;

    const task = await this.taskRepository.findOne({
      where: { taskId },
    });

    if (!task) {
      throw new NotFoundException(`Task with ID ${taskId} not found`);
    }

    // Soft delete
    await this.taskRepository.softRemove(task);

    this.eventBus.publish(new TaskDeletedEvent(taskId, task.projectId));

    return { deleted: true, taskId };
  }
}
