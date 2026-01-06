import { Module } from '@nestjs/common';
import { AuthModule } from './auth';
import { ICryptoService } from '../services';
import { CryptoService } from './crypto.service';
import { PrismaService } from '../db-conection';

@Module({
  imports: [AuthModule],
  providers: [
    PrismaService,
    {
      provide: ICryptoService,
      useClass: CryptoService,
    },
  ],
  exports: [AuthModule, ICryptoService, PrismaService],
})
export class ProviderModule {}
