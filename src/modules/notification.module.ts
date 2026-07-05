import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { NotificationController } from '../controllers/notification.controller';
import { PrismaNotificationRepository } from '../repositories/implementation/PrismaNotificationRepository';
import {
  CreateNotificationUseCase,
  GetUserNotificationsUseCase,
  MarkNotificationAsReadUseCase,
  MarkAllNotificationsAsReadUseCase,
} from '../usecases/notification.usecases';

@Module({
  imports: [PrismaModule],
  controllers: [NotificationController],
  providers: [
    {
      provide: 'INotificationRepository',
      useClass: PrismaNotificationRepository,
    },
    CreateNotificationUseCase,
    GetUserNotificationsUseCase,
    MarkNotificationAsReadUseCase,
    MarkAllNotificationsAsReadUseCase,
  ],
  exports: [CreateNotificationUseCase], // Exportado para ser injetado noutros módulos
})
export class NotificationModule {}
