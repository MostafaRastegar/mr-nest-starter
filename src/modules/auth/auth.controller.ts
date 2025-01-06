// src/modules/auth/auth.controller.ts
import { Controller, Post, Body, HttpException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { ApiBody, ApiCreatedResponse } from '@nestjs/swagger';
import { RegisterResponseDto } from './dto/registerResponse.dto';
import { plainToInstance } from 'class-transformer';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiBody({
    type: RegisterDto,
    description: 'Json structure for user object',
  })
  @ApiCreatedResponse({ type: RegisterResponseDto })
  async register(
    @Body() registerDto: RegisterDto,
  ): Promise<RegisterResponseDto> {
    const user = await this.authService.register(registerDto);
    return plainToInstance(RegisterResponseDto, user);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto.username, loginDto.password);
  }
}
