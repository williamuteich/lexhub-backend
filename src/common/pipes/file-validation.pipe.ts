import { PipeTransform, Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { FILE_UPLOAD_CONSTRAINTS, FILE_UPLOAD_MESSAGES } from 'src/storage/constants/file-upload.constants';

@Injectable()
export class FileValidationPipe implements PipeTransform {
  constructor(private readonly allowedMimeTypes?: string[]) {}

  transform(file: Express.Multer.File) {
    if (!file) {
      throw new HttpException(FILE_UPLOAD_MESSAGES.NO_FILE, HttpStatus.BAD_REQUEST);
    }

    const mimeTypes = this.allowedMimeTypes || [
      ...FILE_UPLOAD_CONSTRAINTS.ALLOWED_IMAGE_MIME_TYPES,
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    if (!mimeTypes.includes(file.mimetype)) {
      throw new HttpException(
        `Invalid file type. Allowed: ${mimeTypes.join(', ')}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    if (file.size > FILE_UPLOAD_CONSTRAINTS.MAX_FILE_SIZE) {
      throw new HttpException(FILE_UPLOAD_MESSAGES.FILE_TOO_LARGE, HttpStatus.BAD_REQUEST);
    }

    return file;
  }
}
