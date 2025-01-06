// src/modules/auth/entities/user.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Message } from '../../chat/entities/message.entity';
import { Group } from 'src/modules/chat/entities/group.entity';
import { Channel } from 'src/modules/chat/entities/channel.entity';

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
  MODERATOR = 'moderator',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ default: 'offline' })
  status: string;

  // Add this line to store the socket ID
  @Column({ nullable: true })
  socketId?: string; // Nullable in case the user is not connected

  @Column({ nullable: true })
  profileImage: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @OneToMany(() => Message, (message) => message.user)
  messages: Message[];

  @ManyToMany(() => Group, (group) => group.users)
  @JoinTable()
  groups: Group[];

  @ManyToMany(() => Channel, (channel) => channel.users)
  @JoinTable()
  channels: Channel[];
}
