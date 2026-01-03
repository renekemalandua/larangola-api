import {
	ExceptionFilter,
	Catch,
	ArgumentsHost,
	HttpException,
	BadRequestException,
} from '@nestjs/common';
import { Response } from 'express';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Catch(HttpException, PrismaClientKnownRequestError, BadRequestException)
export class HttpExceptionFilter implements ExceptionFilter {
	catch(
		exception:
			| HttpException
			| PrismaClientKnownRequestError
			| BadRequestException,
		host: ArgumentsHost,
	) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();
		const status =
			exception instanceof HttpException ||
				exception instanceof BadRequestException
				? exception.getStatus()
				: 500;
		const message =
			exception instanceof HttpException ||
				exception instanceof BadRequestException
				? exception.message
				: 'Internal Server Error';

		return response.status(status).json({
			status: false,
			statusCode: status,
			message: message,
			timestamp: new Date().toISOString(),
		});
	}
}

