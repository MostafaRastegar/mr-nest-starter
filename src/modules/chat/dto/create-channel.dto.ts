// src/modules/chat/dto/create-channel.dto.ts
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateChannelDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  description: string;
}
