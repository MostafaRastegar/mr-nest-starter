import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../entities/user.entity';

export class RegisterResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  username: string;

  @ApiProperty()
  status: string;

  @ApiProperty({ required: false })
  socketId?: string; // Nullable in case the user is not connected

  @ApiProperty()
  profileImage: string;

  @ApiProperty({ example: UserRole.ADMIN })
  role: UserRole;

  @ApiProperty({ example: [1] })
  messages: number[];

  @ApiProperty({ example: [1] })
  groups: number[];

  @ApiProperty({ example: [1] })
  channels: number[];
}
