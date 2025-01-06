// src/modules/chat/chat.controller.ts
import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChannelDto } from './dto/create-channel.dto';
import { CreateGroupDto } from './dto/create-group.dto';
import { SendMessageDto } from './dto/send-message.dto';
import { Message } from './entities/message.entity';

@Controller('chats')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('channel')
  async createChannel(@Body() createChannelDto: CreateChannelDto) {
    return this.chatService.createChannel(createChannelDto);
  }

  @Post('group')
  async createGroup(@Body() createGroupDto: CreateGroupDto) {
    return this.chatService.createGroup(createGroupDto);
  }

  // Endpoint to send a message
  @Post('send')
  async sendMessage(@Body() sendMessageDto: SendMessageDto): Promise<Message> {
    return this.chatService.sendMessage(sendMessageDto);
  }

  // Endpoint to get message history
  @Get('history')
  async getMessageHistory(
    @Query('groupId') groupId?: number,
    @Query('channelId') channelId?: number,
    @Query('limit') limit: number = 50,
    @Query('offset') offset: number = 0,
  ): Promise<Message[]> {
    return this.chatService.getMessageHistory(
      groupId,
      channelId,
      limit,
      offset,
    );
  }
}
