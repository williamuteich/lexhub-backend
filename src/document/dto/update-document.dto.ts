import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateDocumentDto {
  @ApiPropertyOptional({ example: 'CPF', description: 'Document name/title' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ example: 'https://pub-xxx.r2.dev/documents/new.pdf', description: 'File URL from R2' })
  @IsString()
  @IsOptional()
  fileUrl?: string;

  @ApiPropertyOptional({ example: 'documents/new.pdf', description: 'File key for R2 deletion' })
  @IsString()
  @IsOptional()
  fileKey?: string;

  @ApiPropertyOptional({ example: 2097152, description: 'File size in bytes' })
  @IsOptional()
  fileSize?: number;

  @ApiPropertyOptional({ example: 'image/jpeg', description: 'File MIME type' })
  @IsString()
  @IsOptional()
  mimeType?: string;
}
