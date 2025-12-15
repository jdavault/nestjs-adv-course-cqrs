import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import { TaskStatus, TaskPriority } from '../task.entity';

registerEnumType(TaskStatus, {
  name: 'TaskStatus',
  description: 'Task status enum',
});

registerEnumType(TaskPriority, {
  name: 'TaskPriority',
  description: 'Task priority enum',
});

@ObjectType()
export class TaskType {
  @Field(() => ID)
  taskId: string;

  @Field(() => ID)
  projectId: string;

  @Field(() => ID, { nullable: true })
  assigneeId?: string;

  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => TaskStatus)
  status: TaskStatus;

  @Field(() => TaskPriority)
  priority: TaskPriority;

  @Field({ nullable: true })
  dueDate?: Date;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

@ObjectType()
export class DeleteTaskResponse {
  @Field()
  deleted: boolean;

  @Field()
  taskId: string;
}
