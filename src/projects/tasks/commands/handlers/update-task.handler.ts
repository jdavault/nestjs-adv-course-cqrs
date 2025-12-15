import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { UpdateTaskCommand } from '../impl/update-task.command';
import { TaskRepository } from '../../repositories/task.repository';
import { TaskUpdatedEvent } from '../../events/impl/task-updated.event';
import { NotFoundException } from '@nestjs/common';

@CommandHandler(UpdateTaskCommand)
export class UpdateTaskHandler implements ICommandHandler<UpdateTaskCommand> {
  constructor(
    private readonly taskRepository: TaskRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: UpdateTaskCommand) {
    const { taskId, data } = command;

    const task = await this.taskRepository.findOne({
      where: { taskId },
    });

    if (!task) {
      throw new NotFoundException(`Task with ID ${taskId} not found`);
    }

    Object.assign(task, data);

    const updatedTask = await this.taskRepository.save(task);

    this.eventBus.publish(
      new TaskUpdatedEvent(updatedTask.taskId, updatedTask.projectId, data),
    );

    return updatedTask;
  }
}
