import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UploadPDFDTO {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Arquivo PDF a ser enviado',
  })
  file?: any;

  @ApiProperty({
    type: String,
    example: 'comprovativos',
    description: 'Nome da pasta onde o PDF será salvo',
  })
  @IsString()
  folder: string;
}
