import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { IUploadService } from '../../services/IUploadService';
import { UploadPDFDTO } from './upload.dto';
import { HttpErrorResponseDTO } from '../../dto/http-error-response.dto';

@ApiTags('Uploads')
@Controller('Uploads')
export class UploadController {
  constructor(private readonly uploadService: IUploadService) {}

  @Post('pdf')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Fazer upload de um arquivo PDF' })
  @ApiBody({ type: UploadPDFDTO })
  @ApiResponse({
    status: 201,
    description: 'Upload realizado com sucesso. Retorna URL.',
  })
  @ApiResponse({
    description: 'Estrutura dos erros de requisição',
    type: HttpErrorResponseDTO,
  })
  async uploadPDF(
    @UploadedFile() file: Express.Multer.File,
    @Body('folder') folder: string
  ) {
    const url = await this.uploadService.uploadPDF(file, folder);
    return { url };
  }
}
