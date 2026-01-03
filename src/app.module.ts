import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ProviderModule } from './shared';

@Module({
	imports: [ProviderModule],
	controllers: [AppController],
	providers: [],
})
export class AppModule { }

