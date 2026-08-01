import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { IPropertyAuditRequestRepository } from '../repositories/IPropertyAuditRequestRepository';

@Injectable()
export class PropertyAuditCronService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PropertyAuditCronService.name);
  private intervalId: NodeJS.Timeout;

  constructor(private readonly repository: IPropertyAuditRequestRepository) {}

  onModuleInit() {
    this.logger.log('Initializing 5-hour SLA check routine for Owner Submissions...');
    // Check every 5 minutes
    this.intervalId = setInterval(() => {
      this.checkExpiredValidations();
    }, 5 * 60 * 1000);
    
    // Also run immediately on start
    this.checkExpiredValidations();
  }

  onModuleDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  private async checkExpiredValidations() {
    try {
      // 5 hours timeout
      const affectedRows = await this.repository.resetExpiredValidations(5);
      if (affectedRows > 0) {
        this.logger.log(`SLA Timeout: Reset ${affectedRows} PropertyAuditRequests back to PENDING because they exceeded the 5-hour validation limit.`);
      }
    } catch (error) {
      this.logger.error('Failed to run checkExpiredValidations', error.stack);
    }
  }
}
