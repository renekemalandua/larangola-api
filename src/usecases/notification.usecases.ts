import { Injectable, Inject } from '@nestjs/common';
import { INotificationRepository } from '../repositories/INotificationRepository';
import { NotificationEntity } from '../entities/notification.entity';
import { NotificationType } from '@prisma/client';

export interface CreateNotificationDTO {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
}

@Injectable()
export class CreateNotificationUseCase {
  constructor(
    @Inject('INotificationRepository')
    private readonly notificationRepo: INotificationRepository,
  ) {}

  async execute(data: CreateNotificationDTO): Promise<NotificationEntity> {
    const notification = new NotificationEntity({
      userId: data.userId,
      type: data.type,
      title: data.title,
      message: data.message,
      read: false,
      link: data.link,
    });

    return this.notificationRepo.create(notification);
  }
}

@Injectable()
export class GetUserNotificationsUseCase {
  constructor(
    @Inject('INotificationRepository')
    private readonly notificationRepo: INotificationRepository,
  ) {}

  async execute(userId: string) {
    const notifications = await this.notificationRepo.findByUserId(userId);
    const unreadCount = await this.notificationRepo.getUnreadCount(userId);
    return { notifications, unreadCount };
  }
}

@Injectable()
export class MarkNotificationAsReadUseCase {
  constructor(
    @Inject('INotificationRepository')
    private readonly notificationRepo: INotificationRepository,
  ) {}

  async execute(notificationId: string): Promise<NotificationEntity> {
    return this.notificationRepo.markAsRead(notificationId);
  }
}

@Injectable()
export class MarkAllNotificationsAsReadUseCase {
  constructor(
    @Inject('INotificationRepository')
    private readonly notificationRepo: INotificationRepository,
  ) {}

  async execute(userId: string): Promise<void> {
    await this.notificationRepo.markAllAsRead(userId);
  }
}
