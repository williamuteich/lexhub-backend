import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class DocumentDto {
  @ApiProperty({
    description: 'Document unique identifier',
    example: '507f1f77bcf86cd799439011',
  })
  id: string;

  @ApiProperty({
    description: 'Client ID',
    example: '507f1f77bcf86cd799439011',
  })
  clientId: string;

  @ApiProperty({
    description: 'Document name/title',
    example: 'RG',
  })
  name: string;

  @ApiProperty({
    description: 'File URL from R2',
    example: 'https://pub-xxx.r2.dev/documents/abc123.pdf',
  })
  fileUrl: string;

  @ApiProperty({
    description: 'File key for R2 deletion',
    example: 'documents/abc123.pdf',
  })
  fileKey: string;

  @ApiPropertyOptional({
    description: 'File size in bytes',
    example: 1048576,
    nullable: true,
  })
  fileSize?: number | null;

  @ApiPropertyOptional({
    description: 'File MIME type',
    example: 'application/pdf',
    nullable: true,
  })
  mimeType?: string | null;

  @ApiProperty({
    description: 'Document creation timestamp',
    example: '2024-01-15T10:30:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Document last update timestamp',
    example: '2024-01-15T10:30:00.000Z',
  })
  updatedAt: Date;
}
