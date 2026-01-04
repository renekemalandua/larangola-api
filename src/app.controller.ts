import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('App')
@Controller()
export class AppController {
	@Get()
	getHello(): { message: string } {
		return { message: 'LarAngola API' };
	}
}



