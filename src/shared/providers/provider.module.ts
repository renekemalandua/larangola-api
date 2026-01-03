import { Module } from '@nestjs/common';
import { PrismaService } from '../db-conection';

@Module({
	providers: [PrismaService],
	exports: [PrismaService],
})
export class ProviderModule { }


