import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class DocumentoProcessoDto {
  @ApiProperty({
    description: 'ID do documento',
    example: '507f1f77bcf86cd799439011',
  })
  id: string;

  @ApiProperty({
    description: 'ID do processo',
    example: '507f1f77bcf86cd799439012',
  })
  processoId: string;

  @ApiProperty({
    description: 'Nome do documento',
    example: 'Petição Inicial',
  })
  nome: string;

  @ApiPropertyOptional({
    description: 'Descrição do documento',
    example: 'Petição inicial do processo de divórcio',
  })
  descricao?: string | null;

  @ApiPropertyOptional({
    description: 'Tipo do documento',
    example: 'PETICAO',
  })
  tipo?: string | null;

  @ApiProperty({
    description: 'URL do arquivo',
    example: 'https://pub-123.r2.dev/documents/abc123.pdf',
  })
  fileUrl: string;

  @ApiProperty({
    description: 'Chave do arquivo no storage',
    example: 'documents/abc123.pdf',
  })
  fileKey: string;

  @ApiPropertyOptional({
    description: 'Tamanho do arquivo em bytes',
    example: 1024000,
  })
  fileSize?: number | null;

  @ApiPropertyOptional({
    description: 'Tipo MIME do arquivo',
    example: 'application/pdf',
  })
  mimeType?: string | null;

  @ApiProperty({
    description: 'Data de criação',
    example: '2024-01-15T10:30:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Data de atualização',
    example: '2024-01-15T10:30:00.000Z',
  })
  updatedAt: Date;
}