import { ApiProperty } from '@nestjs/swagger';

export class AgendamentoDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  id: string;

  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  clientId: string;

  @ApiProperty({ example: 'Consulta Jurídica' })
  titulo: string;

  @ApiProperty({ example: 'Discussão sobre abertura de processo', required: false })
  descricao?: string | null;

  @ApiProperty({ example: '2025-10-25T14:30:00.000Z' })
  dataHora: Date;

  @ApiProperty({ example: 'Escritório - Sala 2', required: false })
  local?: string | null;

  @ApiProperty({ example: 'https://meet.google.com/abc-defg-hij', required: false })
  link?: string | null;

  @ApiProperty({ example: '2025-10-22T19:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2025-10-22T19:00:00.000Z' })
  updatedAt: Date;
}
