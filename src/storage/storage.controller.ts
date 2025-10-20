import {
  Controller,
  Post,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { StorageService } from './storage.service';
import { UploadResponseDto } from './dto/upload-response.dto';
import { AuthTokenGuard } from 'src/auth/guard/auth-token.guard';
import { FileValidationPipe } from 'src/common/pipes/file-validation.pipe';
import { FILE_UPLOAD_CONSTRAINTS } from './constants/file-upload.constants';
import { UploadFile } from 'src/common/decorators/upload-file.decorator';

@ApiTags('Storage')
@Controller('storage')
@UseGuards(AuthTokenGuard)
@ApiBearerAuth()
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Post('upload')
  @UploadFile()
  async uploadFile(
    @UploadedFile(new FileValidationPipe(FILE_UPLOAD_CONSTRAINTS.ALLOWED_IMAGE_MIME_TYPES)) file: Express.Multer.File,
  ): Promise<UploadResponseDto> {
    return this.storageService.uploadFile(file, FILE_UPLOAD_CONSTRAINTS.DEFAULT_FOLDER);
  }
}
