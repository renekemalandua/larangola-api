import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiParam, ApiResponse, ApiTags, ApiConsumes, ApiBearerAuth } from '@nestjs/swagger';
import { HttpErrorResponseDTO } from '../shared';
import { JwtAuthGuard } from '../shared/guards/jwt-auth.guard';
import {
  CreateSubscriptionPaymentUseCase,
  ListMyPaymentsUseCase,
  UploadPaymentProofUseCase,
} from '../usecases/payment.usecases';
import { CreateSubscriptionPaymentRequestDTO } from '../dto/payment.dto';
import { PaymentAdapter } from '../adapters/payment.adapter';

@ApiTags('Payments')
@Controller('payments')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PaymentController {
  constructor(
    private readonly createUseCase: CreateSubscriptionPaymentUseCase,
    private readonly uploadProofUseCase: UploadPaymentProofUseCase,
    private readonly listMyPaymentsUseCase: ListMyPaymentsUseCase
  ) {}

  @Post('subscription')
  @ApiOperation({ summary: 'Create a subscription payment intent' })
  @ApiResponse({ status: 201 })
  @ApiResponse({ status: 400, type: HttpErrorResponseDTO })
  async createSubscriptionPayment(
    @Body() body: CreateSubscriptionPaymentRequestDTO,
    @Request() req,
    @Res() response
  ) {
    try {
      const entity = await this.createUseCase.execute({
        userId: req.user.id,
        planId: body.planId,
      });
      const data = PaymentAdapter.toHttp(entity);
      return response.status(201).json({ status: true, data });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post(':id/upload-proof')
  @ApiOperation({ summary: 'Upload proof of payment' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 400, type: HttpErrorResponseDTO })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  async uploadProof(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Request() req,
    @Res() response
  ) {
    try {
      if (!file) throw new BadRequestException('Image file is required');
      const entity = await this.uploadProofUseCase.execute({
        userId: req.user.id,
        paymentId: id,
        file,
      });
      const data = PaymentAdapter.toHttp(entity);
      return response.status(200).json({ status: true, data });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get('my-payments')
  @ApiOperation({ summary: 'List my payments' })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 400, type: HttpErrorResponseDTO })
  async listMyPayments(@Request() req, @Res() response) {
    try {
      const entities = await this.listMyPaymentsUseCase.execute(req.user.id);
      const data = entities.map((e) => PaymentAdapter.toHttp(e));
      return response.status(200).json({ status: true, data });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
