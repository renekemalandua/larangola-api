import { Module } from '@nestjs/common';
import { AuthModule } from './auth';
import { UploadModule } from './upload/upload.module';
import { EmailModule } from './email/email.module';
import { ICryptoService } from '../services';
import { CryptoService } from './crypto.service';
import { PrismaService } from '../db-conection';

@Module({
  imports: [AuthModule, UploadModule, EmailModule],
  providers: [
    PrismaService,
    {
      provide: ICryptoService,
      useClass: CryptoService,
    },
  ],
  exports: [AuthModule, UploadModule, EmailModule, ICryptoService, PrismaService],
})
export class ProviderModule {}
