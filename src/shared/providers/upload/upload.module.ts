import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { IUploadService } from '../../services/IUploadService';

@Module({
  providers: [
    UploadService,
    {
      provide: IUploadService,
      useClass: UploadService,
    },
  ],
  controllers: [UploadController],
  exports: [UploadService, IUploadService],
})
export class UploadModule { }
