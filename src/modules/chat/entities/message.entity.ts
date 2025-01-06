// src/modules/chat/entities/message.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { Channel } from './channel.entity';
import { Group } from './group.entity';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @Column({ type: 'timestamp' })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.messages)
  user: User;

  @ManyToOne(() => Group, (group) => group.messages, { nullable: true })
  group: Group;

  @ManyToOne(() => Channel, (channel) => channel.messages, { nullable: true })
  channel: Channel;
}
