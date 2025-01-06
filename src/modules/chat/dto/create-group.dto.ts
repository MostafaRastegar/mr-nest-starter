// src/modules/chat/dto/create-group.dto.ts
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateGroupDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  description: string;
}
