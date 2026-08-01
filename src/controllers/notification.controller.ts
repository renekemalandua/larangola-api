import { Controller, Get, Patch, Param, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../shared/guards/jwt-auth.guard';
import {
  GetUserNotificationsUseCase,
  MarkNotificationAsReadUseCase,
  MarkAllNotificationsAsReadUseCase,
} from '../usecases/notification.usecases';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationController {
  constructor(
    private readonly getUserNotificationsUseCase: GetUserNotificationsUseCase,
    private readonly markNotificationAsReadUseCase: MarkNotificationAsReadUseCase,
    private readonly markAllNotificationsAsReadUseCase: MarkAllNotificationsAsReadUseCase,
  ) {}

  @Get()
  async getMyNotifications(@Request() req: any) {
    const userId = req.user.id;
    return this.getUserNotificationsUseCase.execute(userId);
  }

  @Patch('read-all')
  async markAllAsRead(@Request() req: any) {
    const userId = req.user.id;
    await this.markAllNotificationsAsReadUseCase.execute(userId);
    return { success: true, message: 'All notifications marked as read' };
  }

  @Patch(':id/read')
  async markAsRead(@Param('id') id: string) {
    const notification = await this.markNotificationAsReadUseCase.execute(id);
    return { success: true, data: notification };
  }
}
