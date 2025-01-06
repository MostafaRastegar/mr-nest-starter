// src/modules/chat/chat.gateway.ts
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { ChatService } from './chat.service';
import { NotificationsService } from '../notification/notification.service';
import { UserStatusService } from '../auth/user-status.service';
import { UserService } from '../user/user.service'; // Import your UserService
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import * as jwt from 'jsonwebtoken'; // Import JWT library
import { UpdateUserStatusDto } from '../user/dto/update-user-status.dto';

@WebSocketGateway({ cors: true })
@Injectable()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private logger = new Logger('ChatGateway');

  constructor(
    private readonly chatService: ChatService,

    @Inject(NotificationsService)
    private readonly notificationsService: NotificationsService,

    @Inject(UserStatusService)
    private readonly userStatusService: UserStatusService,
    @Inject(UserStatusService)
    private readonly userService: UserService,
  ) {}

  private async notifyUsersInGroup(groupId: number, message: any) {
    // Fetch the users in the group and notify them
    const groupUsers = await this.chatService.getGroupUsers(groupId);
    groupUsers.forEach((user) => {
      this.server.to(user.socketId).emit('notification', {
        message: `New message in group: ${message.content}`,
        messageId: message.id,
      });
    });
  }

  private async notifyUsersInChannel(channelId: number, message: any) {
    // Fetch the users in the channel and notify them
    const channelUsers = await this.chatService.getChannelUsers(channelId);
    channelUsers.forEach((user) => {
      this.server.to(user.socketId).emit('notification', {
        message: `New message in channel: ${message.content}`,
        messageId: message.id,
      });
    });
  }
  private getUserIdFromClient(client: Socket): number | null {
    // Extract the token from the client's handshake query or headers
    const token = client.handshake.query.token; // Assuming the token is sent in the query
    if (!token) {
      return null;
    }

    try {
      const decoded: any = jwt.verify(token as string, process.env.JWT_SECRET); // Verify the token
      return decoded.userId; // Adjust based on your token structure
    } catch (error) {
      this.logger.error('Invalid token', error);
      return null;
    }
  }
  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
    // You can add logic here to find the user by token or session
    const userId = this.getUserIdFromClient(client); // Implement this method to extract user ID
    if (userId) {
      this.userService.updateSocketId(userId, client.id); // Update socket ID for the user
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    // You may want to clear the socket ID from the user record
    const userId = this.getUserIdFromClient(client); // Implement this method to extract user ID
    if (userId) {
      this.userService.clearSocketId(userId); // Clear the socket ID for the user
    }
  }

  @SubscribeMessage('setStatus')
  async handleSetStatus(
    @MessageBody() data: { userId: number; status: UpdateUserStatusDto },
  ) {
    const updatedStatus = await this.userStatusService.setStatus(
      data.userId,
      data.status,
    );
    this.server.emit('statusUpdate', updatedStatus); // Emit the updated status to all clients
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @MessageBody()
    message: {
      content: string;
      userId: number;
      groupId?: number;
      channelId?: number;
    },
  ) {
    const savedMessage = await this.chatService.sendMessage(message);

    await this.notificationsService.createNotification(
      message.userId,
      `New message in channel ${message.channelId}`,
    );

    // Notify users based on the context of the message
    if (message.groupId) {
      // Notify all users in the group
      this.server
        .to(message.groupId.toString())
        .emit('newMessage', savedMessage);
      this.notifyUsersInGroup(message.groupId, savedMessage);
    } else if (message.channelId) {
      // Notify all users in the channel
      this.server
        .to(message.channelId.toString())
        .emit('newMessage', savedMessage);
      this.notifyUsersInChannel(message.channelId, savedMessage);
    } else {
      // For direct messages or general notifications
      this.server.emit('newMessage', savedMessage);
    }
  }
}
