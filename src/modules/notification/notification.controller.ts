// src/modules/notification/notification.controller.ts
import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { NotificationsService } from './notification.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post('create')
  async createNotification(@Body() body: { userId: number; message: string }) {
    return this.notificationsService.createNotification(
      body.userId,
      body.message,
    );
  }

  @Get(':userId')
  async getUserNotifications(@Param('userId') userId: number) {
    return this.notificationsService.getUserNotifications(userId);
  }
}
