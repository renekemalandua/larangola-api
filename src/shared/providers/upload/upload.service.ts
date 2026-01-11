import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import cloudinary from './cloudinary.config';

@Injectable()
export class UploadService {
  async uploadImage(file: Express.Multer.File): Promise<string> {
    try {
      const maxImageSize = 5 * 1024 * 1024;
      if (file.fieldname === "image") {
        if (file.size > maxImageSize) {
          throw new BadRequestException("A imagem é muito grande tem de ter áte 5MB");
        }
      }

      const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: 'sidias-join/profile-photo' },
          (error, result) => {
            if (error) return reject(error);
            resolve(result as any);
          },
        ).end(file.buffer);
      });

      return result.secure_url;
    } catch (err) {
      throw new InternalServerErrorException('Erro ao fazer upload da imagem');
    }
  }
  async uploadPDF(file: Express.Multer.File, folder: string): Promise<string> {
  try {
    const maxPdfSize = 10 * 1024 * 1024;

    if (file.fieldname !== 'file' && file.fieldname !== 'document') {
      throw new BadRequestException('Campo inválido para o arquivo');
    }

    if (file.mimetype !== 'application/pdf') {
      throw new BadRequestException('Apenas arquivos PDF são permitidos');
    }

    if (file.size > maxPdfSize) {
      throw new BadRequestException('O arquivo PDF é muito grande tem de ter áte 10MB');
    }

    const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: 'raw',
          folder: `sidias-join/${folder}`,
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result as any);
        },
      ).end(file.buffer);
    });

    return result.secure_url;
  } catch (err) {
    throw new InternalServerErrorException('Erro ao fazer upload do PDF');
  }
}

}
