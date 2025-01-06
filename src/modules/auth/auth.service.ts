// src/modules/auth/auth.service.ts
import {
  BadRequestException,
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<User> {
    console.log('registerDto :>> ', registerDto);
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const user = this.usersRepository.create({
      ...registerDto,
      password: hashedPassword,
    });
    console.log('user :>> ', user);
    return this.usersRepository.save(user);
  }

  async findUserByUsername(username: string): Promise<User> {
    return this.usersRepository.findOne({ where: { username } });
  }
  async login(
    username: string,
    password: string,
  ): Promise<{ accessToken: string }> {
    const user = await this.usersRepository.findOne({ where: { username } });
    console.log('user :>> ', user);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new BadRequestException('username or password is incorrect');
    }
    const payload = { username: user.username, sub: user.id };
    return { accessToken: await this.jwtService.signAsync(payload) };
  }
}
