import { IsEnum, IsNotEmpty } from 'class-validator';

// Define an enum for user statuses
export enum UserStatus {
  ONLINE = 'online',
  OFFLINE = 'offline',
  AWAY = 'away',
  BUSY = 'busy',
}

// Create the DTO class
export class UpdateUserStatusDto {
  @IsNotEmpty() // Ensure the status is not empty
  @IsEnum(UserStatus) // Ensure the status is one of the defined enums
  status: UserStatus;
}
