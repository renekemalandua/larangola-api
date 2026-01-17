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
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  ApiConsumes,
} from '@nestjs/swagger';
import { HttpErrorResponseDTO } from '../shared';
import { UploadService } from '../shared/providers/upload/upload.service';
import {
  CreateUserUseCase,
  UpdateUserUseCase,
  DeleteUserUseCase,
  ListUsersUseCase,
  FindUserByIdUseCase,
  FindUserByEmailUseCase,
} from '../usecases/user.usecases';
import { CreateUserRequestDTO, UpdateUserRequestDTO } from '../dto/user.dto';
import { UserAdapter } from '../adapters/user.adapter';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(
    private readonly createUseCase: CreateUserUseCase,
    private readonly updateUseCase: UpdateUserUseCase,
    private readonly deleteUseCase: DeleteUserUseCase,
    private readonly listUseCase: ListUsersUseCase,
    private readonly findByIdUseCase: FindUserByIdUseCase,
    private readonly findByEmailUseCase: FindUserByEmailUseCase,
    private readonly uploadService: UploadService
  ) {}

  @Post('create')
  @ApiOperation({ summary: 'Create a new User' })
  @ApiResponse({ status: 201 })
  @ApiResponse({ status: 400, type: HttpErrorResponseDTO })
  async create(@Body() body: CreateUserRequestDTO, @Res() response) {
    try {
      const entity = await this.createUseCase.execute(body);
      const data = UserAdapter.toHttp(entity);
      return response.status(201).json({ status: true, data });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get('list')
  @ApiOperation({ summary: 'List all Users' })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 400, type: HttpErrorResponseDTO })
  async list(@Res() response) {
    try {
      const entities = await this.listUseCase.execute();
      const data = entities.map((e) => UserAdapter.toHttp(e));
      return response.status(200).json({ status: true, data });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find User by ID' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 400, type: HttpErrorResponseDTO })
  async findById(@Param('id') id: string, @Res() response) {
    try {
      const entity = await this.findByIdUseCase.execute(id);
      const data = UserAdapter.toHttp(entity!);
      return response.status(200).json({ status: true, data });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get('email/:email')
  @ApiOperation({ summary: 'Find User by Email' })
  @ApiParam({ name: 'email' })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 400, type: HttpErrorResponseDTO })
  async findByEmail(@Param('email') email: string, @Res() response) {
    try {
      const entity = await this.findByEmailUseCase.execute(email);
      const data = UserAdapter.toHttp(entity!);
      return response.status(200).json({ status: true, data });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update User' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 400, type: HttpErrorResponseDTO })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('avatar')) // Alterado para 'avatar'
  async update(
    @Param('id') id: string,
    @Body() body: UpdateUserRequestDTO,
    @UploadedFile() file: Express.Multer.File,
    @Res() response
  ) {
    try {
      console.log('Update User - Body:', body);
      console.log('Update User - File:', file);
      if (file) {
        const avatarUrl = await this.uploadService.uploadImage('users', file);
        console.log('Generated Avatar URL:', avatarUrl);
        body.avatar = avatarUrl;
      }
      console.log('Body before execution:', body);
      const entity = await this.updateUseCase.execute({ id, data: body });
      const data = UserAdapter.toHttp(entity);
      return response.status(200).json({ status: true, data });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete User' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 400, type: HttpErrorResponseDTO })
  async delete(@Param('id') id: string, @Res() response) {
    try {
      await this.deleteUseCase.execute(id);
      return response
        .status(200)
        .json({ status: true, data: { message: 'User deleted successfully' } });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
