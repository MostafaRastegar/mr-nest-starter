// src/modules/chat/chat.service.ts
import { Inject, Injectable } from '@nestjs/common';
import { Channel } from './entities/channel.entity';
import { Group } from './entities/group.entity';
import { Message } from './entities/message.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateChannelDto } from './dto/create-channel.dto';
import { CreateGroupDto } from './dto/create-group.dto';
import { SendMessageDto } from './dto/send-message.dto';
import { User } from '../auth/entities/user.entity';
import { MessageBody } from '@nestjs/websockets';
import { UserService } from '../user/user.service';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Channel)
    private channelRepository: Repository<Channel>,

    @InjectRepository(Group)
    private groupRepository: Repository<Group>,

    @Inject(UserService)
    private userService: UserService,

    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
  ) {}

  async createChannel(createChannelDto: CreateChannelDto): Promise<Channel> {
    const channel = this.channelRepository.create(createChannelDto);
    return this.channelRepository.save(channel);
  }

  async createGroup(createGroupDto: CreateGroupDto): Promise<Group> {
    const group = this.groupRepository.create(createGroupDto);
    return this.groupRepository.save(group);
  }

  async sendMessage(
    @MessageBody() bodyMessage: SendMessageDto,
  ): Promise<Message> {
    const { content, userId, channelId, groupId } = bodyMessage;
    let group = null;
    let channel = null;
    const user = await this.userService.findById(userId);
    if (groupId) {
      group = await this.groupRepository.findOne({ where: { id: groupId } });
    }
    if (channelId) {
      channel = await this.channelRepository.findOne({
        where: { id: channelId },
      });
    }
    const message = this.messageRepository.create({
      content,
      user,
      group,
      channel,
    });
    return this.messageRepository.save(message);
  }

  async getGroupUsers(groupId: number): Promise<User[]> {
    const group = await this.groupRepository.findOne({
      where: { id: groupId },
      relations: ['users'], // Load the users relation
    });

    return group ? group.users : [];
  }

  async getChannelUsers(channelId: number): Promise<User[]> {
    const channel = await this.channelRepository.findOne({
      where: { id: channelId },
      relations: ['users'], // Load the users relation
    });

    return channel ? channel.users : [];
  }

  async getMessageHistory(
    groupId?: number,
    channelId?: number,
    limit: number = 50, // Default limit for messages
    offset: number = 0, // Pagination support
  ): Promise<Message[]> {
    const queryBuilder = this.messageRepository.createQueryBuilder('message');

    // If a group ID is provided, filter messages by group
    if (groupId) {
      queryBuilder.where('message.groupId = :groupId', { groupId });
    }

    // If a channel ID is provided, filter messages by channel
    if (channelId) {
      queryBuilder.where('message.channelId = :channelId', { channelId });
    }

    // Add pagination and ordering
    queryBuilder.orderBy('message.createdAt', 'DESC').skip(offset).take(limit);

    // Execute the query and return the messages
    return await queryBuilder.getMany();
  }

  async getMessagesByUser(userId: number): Promise<Message[]> {
    return this.messageRepository.find({
      where: { user: { id: userId } },
      relations: ['user'],
    });
  }
}
