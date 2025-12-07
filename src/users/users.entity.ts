//src/user/users.entity.ts
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('users', { schema: 'testdb' })
export class Users {
  @PrimaryColumn('binary', {
    name: 'userId',
    length: 16,
    transformer: {
      to: (value: string) => {
        if (!value) return value;
        const hex = value.replace(/-/g, '');
        return Buffer.from(hex, 'hex');
      },
      from: (value: Buffer) => {
        if (!value) return value;
        return Buffer.from(value).toString('hex');
      },
    },
  })
  userId: string;

  @Column('varchar', { name: 'username', length: 100 })
  username: string;

  @Column('varchar', { name: 'email', length: 145 })
  email: string;

  @Column('varchar', { name: 'password', length: 120 })
  password: string;
}
