import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  HttpException,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiConsumes, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { StorageService } from './storage.service';
import { UploadResponseDto } from './dto/upload-response.dto';
import { AuthTokenGuard } from 'src/auth/guard/auth-token.guard';
import { FILE_UPLOAD_CONSTRAINTS, FILE_UPLOAD_MESSAGES } from './constants/file-upload.constants';

@ApiTags('Storage')
@Controller('storage')
@UseGuards(AuthTokenGuard)
@ApiBearerAuth()
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<UploadResponseDto> {
    if (!file) {
      throw new HttpException(FILE_UPLOAD_MESSAGES.NO_FILE, HttpStatus.BAD_REQUEST);
    }

    if (!FILE_UPLOAD_CONSTRAINTS.ALLOWED_IMAGE_MIME_TYPES.includes(file.mimetype)) {
      throw new HttpException(FILE_UPLOAD_MESSAGES.INVALID_TYPE, HttpStatus.BAD_REQUEST);
    }

    if (file.size > FILE_UPLOAD_CONSTRAINTS.MAX_FILE_SIZE) {
      throw new HttpException(FILE_UPLOAD_MESSAGES.FILE_TOO_LARGE, HttpStatus.BAD_REQUEST);
    }

    return this.storageService.uploadFile(file, FILE_UPLOAD_CONSTRAINTS.DEFAULT_FOLDER);
  }
}
