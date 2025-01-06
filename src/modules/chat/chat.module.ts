// src/modules/chat/chat.module.ts
import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Channel } from './entities/channel.entity';
import { Group } from './entities/group.entity';
import { Message } from './entities/message.entity';
import { ChatGateway } from './chat.gateway';
import { UserModule } from '../user/user.module'; // Adjust the path if necessary
import { NotificationsModule } from '../notification/notification.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Channel, Group, Message]),
    UserModule,
    NotificationsModule,
    AuthModule,
  ],
  providers: [ChatService, ChatGateway],
  controllers: [ChatController],
})
export class ChatModule {}
