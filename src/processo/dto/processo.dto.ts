import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProcessoStatus, TipoProcesso } from '@prisma/client';

export class ProcessoDto {
  @ApiProperty({
    description: 'Process unique identifier',
    example: '507f1f77bcf86cd799439011',
  })
  id: string;

  @ApiProperty({
    description: 'Process number',
    example: 123456789,
  })
  numeroProcesso: number;

  @ApiProperty({
    description: 'Process type',
    example: 'CIVEL',
    enum: TipoProcesso,
  })
  tipo: TipoProcesso;

  @ApiProperty({
    description: 'Process status',
    example: 'ATIVO',
    enum: ProcessoStatus,
  })
  status: ProcessoStatus;

  @ApiPropertyOptional({
    description: 'Judiciary',
    example: 'Tribunal de Justiça do Estado de Minas Gerais',
    nullable: true,
  })
  tribunal?: string | null;

  @ApiProperty({
    description: 'Process opening date',
    example: '2024-01-15T10:30:00.000Z',
  })
  dataAbertura: Date;

  @ApiPropertyOptional({
    description: 'Process closing date',
    example: '2024-12-31T18:00:00.000Z',
    nullable: true,
  })
  dataEncerramento?: Date | null;

  @ApiProperty({
    description: 'Client ID (who opened the process)',
    example: '507f1f77bcf86cd799439011',
  })
  clientId: string;

  @ApiProperty({
    description: 'Responsible lawyer ID',
    example: '507f1f77bcf86cd799439011',
  })
  responsavelId: string;

  @ApiProperty({
    description: 'Opposing party name',
    example: 'Empresa XYZ Ltda',
  })
  parteContraria: string;

  @ApiProperty({
    description: 'Process creation timestamp',
    example: '2024-01-15T10:30:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Process last update timestamp',
    example: '2024-01-15T10:30:00.000Z',
  })
  updatedAt: Date;
}
