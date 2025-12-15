import {
  Column,
  Entity,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  VersionColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { uuidTransformer, Users } from '../../users/users.entity';
import { Project } from '../project.entity';

export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
}

export enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

@Entity('tasks')
export class Task {
  @PrimaryColumn('bytea', {
    name: 'taskId',
    transformer: uuidTransformer,
  })
  taskId: string;

  @Column('bytea', {
    name: 'projectId',
    transformer: uuidTransformer,
  })
  projectId: string;

  @ManyToOne(() => Project)
  @JoinColumn({ name: 'projectId' })
  project: Project;

  @Column('bytea', {
    name: 'assigneeId',
    nullable: true,
    transformer: uuidTransformer,
  })
  assigneeId?: string;

  @ManyToOne(() => Users)
  @JoinColumn({ name: 'assigneeId' })
  assignee?: Users;

  @Column('varchar', { name: 'title', length: 200 })
  title: string;

  @Column('text', { name: 'description', nullable: true })
  description?: string;

  @Column({
    type: 'varchar',
    length: 20,
    default: TaskStatus.TODO,
  })
  status: TaskStatus;

  @Column({
    type: 'varchar',
    length: 10,
    default: TaskPriority.MEDIUM,
  })
  priority: TaskPriority;

  @Column('timestamp', { name: 'dueDate', nullable: true })
  dueDate?: Date;

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deletedAt' })
  deletedAt?: Date;

  @VersionColumn({ default: 1 })
  version: number;
}
