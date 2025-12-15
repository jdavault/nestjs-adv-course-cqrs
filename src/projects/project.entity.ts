import {
  Column,
  Entity,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  VersionColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Users, uuidTransformer } from '../users/users.entity';

export enum ProjectStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  ARCHIVED = 'ARCHIVED',
}

@Entity('projects')
export class Project {
  @PrimaryColumn('bytea', {
    name: 'projectId',
    transformer: uuidTransformer,
  })
  projectId: string;

  @Column('bytea', {
    name: 'userId',
    transformer: uuidTransformer,
  })
  userId: string;

  @ManyToOne(() => Users)
  @JoinColumn({ name: 'userId' })
  user: Users;

  @Column('varchar', { name: 'name', length: 100 })
  name: string;

  @Column('text', { name: 'description', nullable: true })
  description?: string;

  @Column({
    type: 'varchar',
    length: 20,
    default: ProjectStatus.DRAFT,
  })
  status: ProjectStatus;

  @Column('timestamp', { name: 'deadline', nullable: true })
  deadline?: Date;

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deletedAt' })
  deletedAt?: Date;

  @VersionColumn({ default: 1 })
  version: number;
}
