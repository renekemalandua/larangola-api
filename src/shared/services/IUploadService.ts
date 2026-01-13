export abstract class IUploadService {
  abstract uploadImage(folder: string, file: Express.Multer.File): Promise<string>;
  abstract uploadPDF(file: Express.Multer.File, folder: string): Promise<string>;
}
