import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { randomUUID } from 'crypto';
import s3Client from './s3.config';
import { IUploadService } from '../../services/IUploadService';

const BUCKET = process.env.AWS_S3_BUCKET!;
const REGION = process.env.AWS_REGION || 'us-east-1';

function buildPublicUrl(key: string): string {
  return `https://${BUCKET}.s3.${REGION}.amazonaws.com/${key}`;
}

@Injectable()
export class S3UploadService implements IUploadService {
  async uploadImage(
    folder: string,
    file: Express.Multer.File
  ): Promise<string> {
    const maxImageSize = 5 * 1024 * 1024;
    if (file.size > maxImageSize) {
      throw new BadRequestException('A imagem é muito grande, o limite é de 5MB');
    }

    const ext = file.originalname.split('.').pop() || 'jpg';
    const key = `larangola/${folder}/${randomUUID()}.${ext}`;

    try {
      await s3Client.send(
        new PutObjectCommand({
          Bucket: BUCKET,
          Key: key,
          Body: file.buffer,
          ContentType: file.mimetype,
        })
      );
      return buildPublicUrl(key);
    } catch {
      throw new InternalServerErrorException('Erro ao fazer upload da imagem');
    }
  }

  async uploadPDF(file: Express.Multer.File, folder: string): Promise<string> {
    if (file.fieldname !== 'file' && file.fieldname !== 'document') {
      throw new BadRequestException('Campo inválido para o arquivo');
    }

    if (file.mimetype !== 'application/pdf') {
      throw new BadRequestException('Apenas arquivos PDF são permitidos');
    }

    const maxPdfSize = 10 * 1024 * 1024;
    if (file.size > maxPdfSize) {
      throw new BadRequestException('O arquivo PDF é muito grande, o limite é de 10MB');
    }

    const key = `larangola/${folder}/${randomUUID()}.pdf`;

    try {
      await s3Client.send(
        new PutObjectCommand({
          Bucket: BUCKET,
          Key: key,
          Body: file.buffer,
          ContentType: 'application/pdf',
        })
      );
      return buildPublicUrl(key);
    } catch {
      throw new InternalServerErrorException('Erro ao fazer upload do PDF');
    }
  }

  async uploadVideo(
    file: Express.Multer.File,
    folder: string
  ): Promise<string> {
    const maxVideoSize = 50 * 1024 * 1024;
    if (file.size > maxVideoSize) {
      throw new BadRequestException('O vídeo é muito grande, o limite é de 50MB');
    }

    const ext = file.originalname.split('.').pop() || 'mp4';
    const key = `larangola/${folder}/${randomUUID()}.${ext}`;

    try {
      await s3Client.send(
        new PutObjectCommand({
          Bucket: BUCKET,
          Key: key,
          Body: file.buffer,
          ContentType: file.mimetype,
        })
      );
      return buildPublicUrl(key);
    } catch {
      throw new InternalServerErrorException('Erro ao fazer upload do vídeo');
    }
  }
}
