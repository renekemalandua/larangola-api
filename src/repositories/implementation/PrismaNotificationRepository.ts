import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/db-conection/prisma.service';
import { INotificationRepository } from '../INotificationRepository';
import { NotificationEntity } from '../../entities/notification.entity';
import { Notification } from '@prisma/client';

@Injectable()
export class PrismaNotificationRepository implements INotificationRepository {
  constructor(private prisma: PrismaService) {}

  private mapToEntity(model: Notification): NotificationEntity {
    return new NotificationEntity(
      {
        userId: model.userId,
        type: model.type,
        title: model.title,
        message: model.message,
        read: model.read,
        link: model.link || undefined,
      },
      model.id,
      model.createdAt,
      model.updatedAt,
    );
  }

  async create(notification: NotificationEntity): Promise<NotificationEntity> {
    const data = await this.prisma.notification.create({
      data: {
        userId: notification.userId,
        type: notification.type,
        title: notification.title,
        message: notification.message,
        read: notification.read,
        link: notification.link,
      },
    });
    return this.mapToEntity(data);
  }

  async findByUserId(userId: string): Promise<NotificationEntity[]> {
    const data = await this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    return data.map((d) => this.mapToEntity(d));
  }

  async markAsRead(notificationId: string): Promise<NotificationEntity> {
    const data = await this.prisma.notification.update({
      where: { id: notificationId },
      data: { read: true },
    });
    return this.mapToEntity(data);
  }

  async markAllAsRead(userId: string): Promise<void> {
    await this.prisma.notification.updateMany({
      where: { userId, read: false },
      data: { read: true },
    });
  }

  async getUnreadCount(userId: string): Promise<number> {
    return this.prisma.notification.count({
      where: { userId, read: false },
    });
  }
}
