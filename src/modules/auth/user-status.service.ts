import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserStatus } from './entities/user-status.entity';
import { User } from './entities/user.entity';
import { UpdateUserStatusDto } from '../user/dto/update-user-status.dto';
import { UserService } from '../user/user.service';

@Injectable()
export class UserStatusService {
  constructor(
    @InjectRepository(UserStatus)
    private userStatusRepository: Repository<UserStatus>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private userService: UserService,
  ) {}

  async setStatus(
    userId: number,
    updateUserStatusDto: UpdateUserStatusDto,
  ): Promise<void> {
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new NotFoundException(`User  with ID ${userId} not found`);
    }

    user.status = updateUserStatusDto.status; // Update the user's status
    await this.userRepository.save(user); // Use the repository to save changes

    // Optional: Log the status change
    console.log(
      `User  ${userId} status updated to ${updateUserStatusDto.status}`,
    );
  }

  async getStatus(userId: number): Promise<UserStatus> {
    return this.userStatusRepository.findOne({
      where: { user: { id: userId } },
    });
  }
}
