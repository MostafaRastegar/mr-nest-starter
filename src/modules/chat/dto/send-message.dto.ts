// src/modules/chat/dto/send-message.dto.ts
import { IsNotEmpty, IsOptional, IsString, IsInt } from 'class-validator';

export class SendMessageDto {
  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  @IsInt()
  userId: number;

  @IsOptional()
  @IsInt()
  groupId?: number;

  @IsOptional()
  @IsInt()
  channelId?: number;
}
