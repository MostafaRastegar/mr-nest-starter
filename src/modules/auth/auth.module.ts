// src/modules/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { UserModule } from '../user/user.module';
import { UserStatusService } from './user-status.service';
import { UserStatus } from './entities/user-status.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserStatus]),
    UserModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'your_jwt_secret',
      signOptions: { expiresIn: '60m' },
    }),
  ],
  providers: [AuthService, JwtStrategy, UserStatusService],
  controllers: [AuthController],
  exports: [AuthService, JwtStrategy, UserStatusService],
})
export class AuthModule {}
