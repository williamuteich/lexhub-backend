import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class BoletoDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  id: string;

  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  clientId: string;

  @ApiProperty({ example: 'Pagamento de honorários - Processo 12345' })
  titulo: string;

  @ApiProperty({ example: 'Referente aos serviços prestados em outubro/2025', required: false })
  observacao?: string | null;

  @ApiProperty({ example: true, description: 'Status do boleto (true = ativo, false = inativo)' })
  status: boolean;

  @ApiProperty({ example: '2025-10-25T00:00:00.000Z', description: 'Data de vencimento do boleto' })
  dataVencimento: Date;

  @ApiProperty({
    description: 'File URL from R2',
    example: 'https://pub-xxx.r2.dev/boletos/abc123.pdf',
  })
  fileUrl: string;

  @ApiProperty({
    description: 'File key for R2 deletion',
    example: 'boletos/abc123.pdf',
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

  @ApiProperty({ example: '2025-10-23T17:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2025-10-23T17:00:00.000Z' })
  updatedAt: Date;
}
