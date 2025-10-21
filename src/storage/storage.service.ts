import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import { UploadResponseDto } from './dto/upload-response.dto';
import { FILE_UPLOAD_CONSTRAINTS } from './constants/file-upload.constants';

@Injectable()
export class StorageService {
  private s3Client: S3Client;
  private bucketName: string;
  private publicUrl: string;

  constructor(private configService: ConfigService) {
    this.bucketName = this.configService.get<string>('R2_BUCKET_NAME') || 'lexhub';
    
    const endpoint = this.configService.get<string>('R2_ENDPOINT');
    const accessKeyId = this.configService.get<string>('R2_ACCESS_KEY_ID');
    const secretAccessKey = this.configService.get<string>('R2_SECRET_ACCESS_KEY');

    if (!endpoint || !accessKeyId || !secretAccessKey) {
      throw new Error('Missing R2 credentials in environment variables');
    }

    this.s3Client = new S3Client({
      region: 'auto',
      endpoint,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });

    this.publicUrl = this.configService.get<string>('R2_PUBLIC_URL') || '';
  }

  async uploadFile(
    file: Express.Multer.File,
    folder: string = FILE_UPLOAD_CONSTRAINTS.DEFAULT_FOLDER,
  ): Promise<UploadResponseDto> {
    const fileExtension = file.originalname.split('.').pop();
    const fileName = `${folder}/${uuidv4()}.${fileExtension}`;

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: fileName,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    await this.s3Client.send(command);

    return {
      url: `${this.publicUrl}/${fileName}`,
      key: fileName,
      bucket: this.bucketName,
    };
  }

  async deleteFile(key: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    await this.s3Client.send(command);
  }

  extractKeyFromUrl(url: string): string | null {
    if (!url || !url.includes(this.publicUrl)) return null;
    return url.replace(`${this.publicUrl}/`, '');
  }
}
