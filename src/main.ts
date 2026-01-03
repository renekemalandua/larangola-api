import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './shared';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { RequestMethod, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.useGlobalFilters(new HttpExceptionFilter());

	app.enableCors({
		origin: '*',
		methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
	});

	app.setGlobalPrefix('api/v1', { exclude: [{ path: '', method: RequestMethod.ALL }] });

	// Swagger
	const swaggerTitle = 'LarAngola API';
	const swaggerPath = `api/doc`;

	const swaggerConfig = new DocumentBuilder()
		.setTitle(swaggerTitle)
		.setDescription('LarAngola API - Backend for LarAngola mobile app')
		.setVersion('0.1')
		.addBearerAuth()
		.build();
	const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
	SwaggerModule.setup(swaggerPath, app, swaggerDocument);

	await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

