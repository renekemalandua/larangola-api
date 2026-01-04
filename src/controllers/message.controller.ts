import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, Res } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HttpErrorResponseDTO } from '../shared';
import {
	CreateMessageUseCase,
	UpdateMessageUseCase,
	DeleteMessageUseCase,
	ListMessagesUseCase,
	ListMessagesByChatUseCase,
	FindMessageByIdUseCase,
	MarkMessagesAsReadUseCase,
} from '../usecases/message.usecases';
import { CreateMessageRequestDTO, UpdateMessageRequestDTO } from '../dto/message.dto';
import { MessageAdapter } from '../adapters/message.adapter';

@ApiTags('Messages')
@Controller('messages')
export class MessageController {
	constructor(
		private readonly createUseCase: CreateMessageUseCase,
		private readonly updateUseCase: UpdateMessageUseCase,
		private readonly deleteUseCase: DeleteMessageUseCase,
		private readonly listUseCase: ListMessagesUseCase,
		private readonly listByChatUseCase: ListMessagesByChatUseCase,
		private readonly findByIdUseCase: FindMessageByIdUseCase,
		private readonly markAsReadUseCase: MarkMessagesAsReadUseCase,
	) { }

	@Post('create')
	@ApiOperation({ summary: 'Create a new Message' })
	@ApiResponse({ status: 201 })
	@ApiResponse({ status: 400, type: HttpErrorResponseDTO })
	async create(@Body() body: CreateMessageRequestDTO, @Res() response) {
		try {
			const entity = await this.createUseCase.execute(body);
			const data = MessageAdapter.toHttp(entity);
			return response.status(201).json({ status: true, data });
		} catch (error) {
			throw new BadRequestException(error.message);
		}
	}

	@Get('list')
	@ApiOperation({ summary: 'List all Messages' })
	@ApiResponse({ status: 200 })
	@ApiResponse({ status: 400, type: HttpErrorResponseDTO })
	async list(@Res() response) {
		try {
			const entities = await this.listUseCase.execute();
			const data = entities.map((e) => MessageAdapter.toHttp(e));
			return response.status(200).json({ status: true, data });
		} catch (error) {
			throw new BadRequestException(error.message);
		}
	}

	@Get(':id')
	@ApiOperation({ summary: 'Find Message by ID' })
	@ApiParam({ name: 'id' })
	@ApiResponse({ status: 200 })
	@ApiResponse({ status: 400, type: HttpErrorResponseDTO })
	async findById(@Param('id') id: string, @Res() response) {
		try {
			const entity = await this.findByIdUseCase.execute(id);
			const data = MessageAdapter.toHttp(entity!);
			return response.status(200).json({ status: true, data });
		} catch (error) {
			throw new BadRequestException(error.message);
		}
	}

	@Get('chat/:chatId')
	@ApiOperation({ summary: 'List Messages by Chat' })
	@ApiParam({ name: 'chatId' })
	@ApiResponse({ status: 200 })
	@ApiResponse({ status: 400, type: HttpErrorResponseDTO })
	async listByChat(@Param('chatId') chatId: string, @Res() response) {
		try {
			const entities = await this.listByChatUseCase.execute(chatId);
			const data = entities.map((e) => MessageAdapter.toHttp(e));
			return response.status(200).json({ status: true, data });
		} catch (error) {
			throw new BadRequestException(error.message);
		}
	}

	@Put(':id')
	@ApiOperation({ summary: 'Update Message' })
	@ApiParam({ name: 'id' })
	@ApiResponse({ status: 200 })
	@ApiResponse({ status: 400, type: HttpErrorResponseDTO })
	async update(@Param('id') id: string, @Body() body: UpdateMessageRequestDTO, @Res() response) {
		try {
			const entity = await this.updateUseCase.execute({ id, data: body });
			const data = MessageAdapter.toHttp(entity);
			return response.status(200).json({ status: true, data });
		} catch (error) {
			throw new BadRequestException(error.message);
		}
	}

	@Post('mark-read/:chatId/:userId')
	@ApiOperation({ summary: 'Mark Messages as Read' })
	@ApiParam({ name: 'chatId' })
	@ApiParam({ name: 'userId' })
	@ApiResponse({ status: 200 })
	@ApiResponse({ status: 400, type: HttpErrorResponseDTO })
	async markAsRead(@Param('chatId') chatId: string, @Param('userId') userId: string, @Res() response) {
		try {
			await this.markAsReadUseCase.execute({ chatId, userId });
			return response.status(200).json({ status: true, data: { message: 'Messages marked as read' } });
		} catch (error) {
			throw new BadRequestException(error.message);
		}
	}

	@Delete(':id')
	@ApiOperation({ summary: 'Delete Message' })
	@ApiParam({ name: 'id' })
	@ApiResponse({ status: 200 })
	@ApiResponse({ status: 400, type: HttpErrorResponseDTO })
	async delete(@Param('id') id: string, @Res() response) {
		try {
			await this.deleteUseCase.execute(id);
			return response.status(200).json({ status: true, data: { message: 'Message deleted successfully' } });
		} catch (error) {
			throw new BadRequestException(error.message);
		}
	}
}


