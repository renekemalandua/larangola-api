import { NotificationEntity } from '../../entities/notification.entity';

export interface INotificationRepository {
  create(notification: NotificationEntity): Promise<NotificationEntity>;
  findByUserId(userId: string): Promise<NotificationEntity[]>;
  markAsRead(notificationId: string): Promise<NotificationEntity>;
  markAllAsRead(userId: string): Promise<void>;
  getUnreadCount(userId: string): Promise<number>;
}
