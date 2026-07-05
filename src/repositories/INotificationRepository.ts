import { NotificationEntity } from '../entities/notification.entity';

export abstract class INotificationRepository {
  abstract create(notification: NotificationEntity): Promise<NotificationEntity>;
  abstract findByUserId(userId: string): Promise<NotificationEntity[]>;
  abstract markAsRead(notificationId: string): Promise<NotificationEntity>;
  abstract markAllAsRead(userId: string): Promise<void>;
  abstract getUnreadCount(userId: string): Promise<number>;
}
