import { NotificationType } from '@prisma/client';

export class NotificationEntity {
  id?: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  link?: string;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(props: Omit<NotificationEntity, 'id' | 'createdAt' | 'updatedAt'>, id?: string, createdAt?: Date, updatedAt?: Date) {
    Object.assign(this, props);
    if (id) this.id = id;
    if (createdAt) this.createdAt = createdAt;
    if (updatedAt) this.updatedAt = updatedAt;
  }
}
