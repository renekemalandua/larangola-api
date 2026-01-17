import { Module } from '@nestjs/common';
import { AuthModule } from './auth';
import { UploadModule } from './upload/upload.module';
import { ICryptoService } from '../services';
import { CryptoService } from './crypto.service';
import { PrismaService } from '../db-conection';

@Module({
  imports: [AuthModule, UploadModule],
  providers: [
    PrismaService,
    {
      provide: ICryptoService,
      useClass: CryptoService,
    },
  ],
  exports: [AuthModule, UploadModule, ICryptoService, PrismaService],
})
export class ProviderModule {}
