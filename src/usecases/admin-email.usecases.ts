import { Injectable, BadRequestException } from '@nestjs/common';
import { UseCase } from '../shared';
import { BroadcastEmailDTO } from '../dto/admin-email.dto';
import { EmailService } from '../shared/providers/email';
import { IUserRepository } from '../repositories/IUserRepository';

@Injectable()
export class AdminBroadcastEmailUseCase implements UseCase<BroadcastEmailDTO, { success: boolean; count: number }> {
  constructor(
    private readonly emailService: EmailService,
    private readonly userRepository: IUserRepository
  ) {}

  async execute(request: BroadcastEmailDTO): Promise<{ success: boolean; count: number }> {
    let recipients: string[] = [];

    if (request.targetAudience === 'ALL_USERS') {
      const allUsers = await this.userRepository.list();
      recipients = allUsers.filter(u => u.isActive && u.email).map(u => u.email);
    } else if (request.targetAudience === 'ALL_AGENTS') {
      const allUsers = await this.userRepository.list(); // Ideally, fetch by role from DB if possible, but list() and filter works for MVP
      recipients = allUsers.filter(u => u.isActive && u.email && u.adminRole !== 'NONE').map(u => u.email);
    } else if (request.targetAudience === 'SPECIFIC_USERS') {
      if (!request.specificUserIds || request.specificUserIds.length === 0) {
        throw new BadRequestException('specificUserIds array must be provided when targetAudience is SPECIFIC_USERS');
      }
      // Assuming you have a way to fetch multiple users by ID, or just iterate.
      for (const userId of request.specificUserIds) {
        const user = await this.userRepository.findById(userId);
        if (user && user.isActive && user.email) {
          recipients.push(user.email);
        }
      }
    } else {
      throw new BadRequestException('Invalid targetAudience');
    }

    if (recipients.length === 0) {
      throw new BadRequestException('No valid recipients found based on the selected audience.');
    }

    // Remove duplicates just in case
    recipients = [...new Set(recipients)];

    const success = await this.emailService.sendBroadcast(recipients, request.subject, request.html);

    return {
      success,
      count: recipients.length
    };
  }
}
