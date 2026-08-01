import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Req,
  Res,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import {
  RequestVerificationUseCase,
  ReviewVerificationUseCase,
  GetMyVerificationUseCase,
  UpdateVerificationUseCase,
} from '../usecases/user-verification.usecases';
import {
  SubmitVerificationRequestDTO,
  ReviewVerificationStepRequestDTO,
  UpdateVerificationRequestDTO,
} from '../dto/user-verification.dto';
import { UserVerificationAdapter } from '../adapters/user-verification.adapter';
import { PrismaService } from '../shared';

@ApiTags('User Verification')
@Controller('verifications')
export class UserVerificationController {
  constructor(
    private readonly requestUseCase: RequestVerificationUseCase,
    private readonly reviewUseCase: ReviewVerificationUseCase,
    private readonly getMyUseCase: GetMyVerificationUseCase,
    private readonly updateUseCase: UpdateVerificationUseCase,
    private readonly prisma: PrismaService
  ) {}

  private async resolveUserId(id: string): Promise<string> {
    const agent = await this.prisma.agent.findUnique({ where: { id } });
    return agent ? agent.userId : id;
  }

  @Post('submit/:userId')
  @ApiOperation({ summary: 'Submit verification data with files' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'documentFront', maxCount: 1 },
      { name: 'documentBack', maxCount: 1 },
      { name: 'selfie', maxCount: 1 },
      { name: 'video', maxCount: 1 },
    ])
  )
  @ApiResponse({ status: 201 })
  async submit(
    @Param('userId') userId: string,
    @Body() body: SubmitVerificationRequestDTO,
    @UploadedFiles()
    files: {
      documentFront?: Express.Multer.File[];
      documentBack?: Express.Multer.File[];
      selfie?: Express.Multer.File[];
      video?: Express.Multer.File[];
    },
    @Res() response
  ) {
    try {
      const resolvedUserId = await this.resolveUserId(userId);
      const entity = await this.requestUseCase.execute({
        userId: resolvedUserId,
        data: body,
        files,
      });
      const data = UserVerificationAdapter.toHttp(entity);
      return response.status(201).json({ status: true, data });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Put('update/:userId')
  @ApiOperation({ summary: 'Update verification data' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'documentFront', maxCount: 1 },
      { name: 'documentBack', maxCount: 1 },
      { name: 'selfie', maxCount: 1 },
      { name: 'video', maxCount: 1 },
    ])
  )
  @ApiResponse({ status: 200 })
  async update(
    @Param('userId') userId: string,
    @Body() body: UpdateVerificationRequestDTO,
    @UploadedFiles()
    files: {
      documentFront?: Express.Multer.File[];
      documentBack?: Express.Multer.File[];
      selfie?: Express.Multer.File[];
      video?: Express.Multer.File[];
    },
    @Res() response
  ) {
    try {
      const resolvedUserId = await this.resolveUserId(userId);
      const entity = await this.updateUseCase.execute({
        userId: resolvedUserId,
        data: body,
        files,
      });
      const data = UserVerificationAdapter.toHttp(entity);
      return response.status(200).json({ status: true, data });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Patch('review')
  @ApiOperation({ summary: 'Admin review of a verification step' })
  @ApiResponse({ status: 200 })
  async review(
    @Body() body: ReviewVerificationStepRequestDTO,
    @Req() request,
    @Res() response
  ) {
    try {
      // In a real app, reviewerId comes from the JWT payload
      const reviewerId = request.user?.id ?? 'admin-uuid';
      const entity = await this.reviewUseCase.execute({
        reviewerId,
        data: body,
      });
      const data = UserVerificationAdapter.toHttp(entity);
      return response.status(200).json({ status: true, data });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get('status/:userId')
  @ApiOperation({ summary: 'Get verification status of a user' })
  @ApiResponse({ status: 200 })
  async getStatus(@Param('userId') userId: string, @Res() response) {
    try {
      const resolvedUserId = await this.resolveUserId(userId);
      const entity = await this.getMyUseCase.execute(resolvedUserId);
      if (!entity) {
        return response.status(200).json({ status: true, data: null });
      }
      const data = UserVerificationAdapter.toHttp(entity);
      return response.status(200).json({ status: true, data });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
