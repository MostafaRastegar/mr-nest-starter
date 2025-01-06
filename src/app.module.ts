// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { ChatModule } from './modules/chat/chat.module';
import { NotificationsModule } from './modules/notification/notification.module';
import { FileUploadModule } from './modules/file-upload/file-upload.module';
import { UserModule } from './modules/user/user.module';
import { appConfig } from './config/app.config';
import { ConfigModule } from '@nestjs/config';
import { databaseConfig } from './config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot(appConfig),
    TypeOrmModule.forRoot({
      ...databaseConfig,
      entities: [__dirname + '/**/*.entity{.ts,.js}'], // Path to your entities
    }),
    AuthModule,
    ChatModule,
    NotificationsModule,
    FileUploadModule,
    UserModule,
  ],
  providers: [],
})
export class AppModule {}
