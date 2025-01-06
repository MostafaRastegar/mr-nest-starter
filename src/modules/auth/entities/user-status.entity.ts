// src/modules/auth/entities/user-status.entity.ts
import { User } from './user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class UserStatus {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 'offline' }) // Default status
  status: string;

  @OneToOne(() => User, (user) => user.status)
  @JoinColumn()
  user: User;
}
