import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { CreateTaskCommand } from '../impl/create-task.command';
import { TaskRepository } from '../../repositories/task.repository';
import { TaskCreatedEvent } from '../../events/impl/task-created.event';
import { TaskStatus, TaskPriority } from '../../task.entity';
import { v4 as uuidv4 } from 'uuid';

@CommandHandler(CreateTaskCommand)
export class CreateTaskHandler implements ICommandHandler<CreateTaskCommand> {
  constructor(
    private readonly taskRepository: TaskRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: CreateTaskCommand) {
    const { projectId, title, description, assigneeId, status, priority, dueDate } =
      command;

    const task = this.taskRepository.create({
      taskId: uuidv4().replace(/-/g, ''),
      projectId,
      title,
      description,
      assigneeId,
      status: status || TaskStatus.TODO,
      priority: priority || TaskPriority.MEDIUM,
      dueDate,
    });

    const savedTask = await this.taskRepository.save(task);

    this.eventBus.publish(
      new TaskCreatedEvent(
        savedTask.taskId,
        savedTask.projectId,
        savedTask.title,
        savedTask.status,
        savedTask.priority,
        savedTask.assigneeId,
        savedTask.description,
        savedTask.dueDate,
      ),
    );

    return savedTask;
  }
}
