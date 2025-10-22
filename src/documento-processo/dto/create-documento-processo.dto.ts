import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateDocumentoProcessoDto {
  @ApiProperty({
    description: 'Nome do documento',
    example: 'Petição Inicial',
  })
  @IsString()
  @IsNotEmpty()
  nome: string;

  @ApiPropertyOptional({
    description: 'Descrição do documento',
    example: 'Petição inicial do processo de divórcio',
  })
  @IsString()
  @IsOptional()
  descricao?: string;

  @ApiPropertyOptional({
    description: 'Tipo do documento',
    example: 'PETICAO',
    enum: ['PETICAO', 'SENTENCA', 'DESPACHO', 'CONTRATO', 'PROCURACAO', 'OUTRO'],
  })
  @IsString()
  @IsOptional()
  tipo?: string;
}