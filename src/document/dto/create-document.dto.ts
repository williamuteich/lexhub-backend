import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateDocumentDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439011', description: 'Client ID' })
  @IsString()
  @IsNotEmpty()
  clientId: string;

  @ApiProperty({ example: 'RG', description: 'Document name/title' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'https://pub-xxx.r2.dev/documents/abc123.pdf', description: 'File URL from R2' })
  @IsString()
  @IsNotEmpty()
  fileUrl: string;

  @ApiProperty({ example: 'documents/abc123.pdf', description: 'File key for R2 deletion' })
  @IsString()
  @IsNotEmpty()
  fileKey: string;

  @ApiProperty({ example: 1048576, description: 'File size in bytes', required: false })
  @IsNotEmpty()
  fileSize?: number;

  @ApiProperty({ example: 'application/pdf', description: 'File MIME type', required: false })
  @IsString()
  mimeType?: string;
}
