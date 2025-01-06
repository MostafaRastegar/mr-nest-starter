// src/modules/user/dto/update-profile.dto.ts
import { IsString, IsOptional } from 'class-validator';

export class UpdateProfileDto {
  @IsString()
  @IsOptional()
  username?: string;

  @IsString()
  @IsOptional()
  profileImage?: string;
}
