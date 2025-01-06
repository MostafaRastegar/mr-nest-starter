// src/modules/chat/entities/channel.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
} from 'typeorm';
import { Message } from './message.entity';
import { User } from 'src/modules/auth/entities/user.entity';

@Entity()
export class Channel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Message, (message) => message.channel)
  messages: Message[];

  @ManyToMany(() => User, (user) => user.channels)
  users: User[];
}
