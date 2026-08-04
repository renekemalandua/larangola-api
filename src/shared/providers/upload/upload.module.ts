import { Module } from '@nestjs/common';
import { CloudinaryUploadService } from './cloudinary-upload.service';
import { S3UploadService } from './s3-upload.service';
import { UploadController } from './upload.controller';
import { IUploadService } from '../../services/IUploadService';

@Module({
  providers: [
    {
      provide: IUploadService,
      useFactory: () => {
        const provider = process.env.UPLOAD_PROVIDER;
        if (provider === 's3') {
          return new S3UploadService();
        }
        return new CloudinaryUploadService();
      },
    },
  ],
  controllers: [UploadController],
  exports: [IUploadService],
})
export class UploadModule {}
