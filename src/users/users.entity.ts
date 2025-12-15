//src/user/users.entity.ts
import {
  Column,
  Entity,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  VersionColumn,
} from 'typeorm';

export const uuidTransformer = {
  to: (value: string) => {
    if (!value) return value;
    const hex = value.replace(/-/g, '');
    return Buffer.from(hex, 'hex');
  },
  from: (value: Buffer) => {
    if (!value) return value;
    return Buffer.from(value).toString('hex');
  },
};

@Entity('users')
export class Users {
  @PrimaryColumn('bytea', {
    name: 'userId',
    transformer: uuidTransformer,
  })
  userId: string;

  @Column('varchar', { name: 'username', length: 100 })
  username: string;

  @Column('varchar', { name: 'email', length: 145 })
  email: string;

  @Column('varchar', { name: 'password', length: 120 })
  password: string;

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deletedAt' })
  deletedAt?: Date;

  @VersionColumn({ default: 1 })
  version: number;
}
