import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Res,
  Query,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { HttpErrorResponseDTO } from '../shared';
import {
  CreateChatUseCase,
  UpdateChatUseCase,
  DeleteChatUseCase,
  ListChatsUseCase,
  ListChatsByUserUseCase,
  FindChatByIdUseCase,
  FindChatByUsersUseCase,
} from '../usecases/chat.usecases';
import { CreateChatRequestDTO, UpdateChatRequestDTO } from '../dto/chat.dto';
import { ChatAdapter } from '../adapters/chat.adapter';

@ApiTags('Chats')
@Controller('chats')
export class ChatController {
  constructor(
    private readonly createUseCase: CreateChatUseCase,
    private readonly updateUseCase: UpdateChatUseCase,
    private readonly deleteUseCase: DeleteChatUseCase,
    private readonly listUseCase: ListChatsUseCase,
    private readonly listByUserUseCase: ListChatsByUserUseCase,
    private readonly findByIdUseCase: FindChatByIdUseCase,
    private readonly findByUsersUseCase: FindChatByUsersUseCase
  ) {}

  @Post('create')
  @ApiOperation({ summary: 'Create a new Chat' })
  @ApiResponse({ status: 201 })
  @ApiResponse({ status: 400, type: HttpErrorResponseDTO })
  async create(@Body() body: CreateChatRequestDTO, @Res() response) {
    try {
      const entity = await this.createUseCase.execute(body);
      const data = ChatAdapter.toHttp(entity);
      return response.status(201).json({ status: true, data });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get('list')
  @ApiOperation({ summary: 'List all Chats' })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 400, type: HttpErrorResponseDTO })
  async list(@Res() response) {
    try {
      const entities = await this.listUseCase.execute();
      const data = entities.map((e) => ChatAdapter.toHttp(e));
      return response.status(200).json({ status: true, data });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find Chat by ID' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 400, type: HttpErrorResponseDTO })
  async findById(@Param('id') id: string, @Res() response) {
    try {
      const entity = await this.findByIdUseCase.execute(id);
      const data = ChatAdapter.toHttp(entity!);
      return response.status(200).json({ status: true, data });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get('users/:user1Id/:user2Id')
  @ApiOperation({ summary: 'Find Chat by Users' })
  @ApiParam({ name: 'user1Id' })
  @ApiParam({ name: 'user2Id' })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 400, type: HttpErrorResponseDTO })
  async findByUsers(
    @Param('user1Id') user1Id: string,
    @Param('user2Id') user2Id: string,
    @Res() response
  ) {
    try {
      const entity = await this.findByUsersUseCase.execute({
        user1Id,
        user2Id,
      });
      const data = ChatAdapter.toHttp(entity!);
      return response.status(200).json({ status: true, data });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'List Chats by User' })
  @ApiParam({ name: 'userId' })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 400, type: HttpErrorResponseDTO })
  async listByUser(@Param('userId') userId: string, @Res() response) {
    try {
      const entities = await this.listByUserUseCase.execute(userId);
      const data = entities.map((e) => ChatAdapter.toHttp(e));
      return response.status(200).json({ status: true, data });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update Chat' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 400, type: HttpErrorResponseDTO })
  async update(
    @Param('id') id: string,
    @Body() body: UpdateChatRequestDTO,
    @Res() response
  ) {
    try {
      const entity = await this.updateUseCase.execute({ id, data: body });
      const data = ChatAdapter.toHttp(entity);
      return response.status(200).json({ status: true, data });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete Chat' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 400, type: HttpErrorResponseDTO })
  async delete(@Param('id') id: string, @Res() response) {
    try {
      await this.deleteUseCase.execute(id);
      return response
        .status(200)
        .json({ status: true, data: { message: 'Chat deleted successfully' } });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
