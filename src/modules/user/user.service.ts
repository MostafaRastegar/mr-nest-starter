// src/modules/user/user.service.ts
import { Injectable } from '@nestjs/common';
import { User } from '../auth/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async updateProfile(
    userId: number,
    updateProfileDto: UpdateProfileDto,
  ): Promise<User> {
    await this.usersRepository.update(userId, updateProfileDto);
    return this.usersRepository.findOne({ where: { id: userId } });
  }
  async findById(userId: number): Promise<User> {
    return this.usersRepository.findOne({ where: { id: userId } });
  }
  async updateSocketId(userId: number, socketId: string) {
    await this.usersRepository.update(userId, { socketId });
  }

  async clearSocketId(userId: number) {
    await this.usersRepository.update(userId, { socketId: null });
  }
}
