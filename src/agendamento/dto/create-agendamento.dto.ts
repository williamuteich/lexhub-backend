import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CreateAgendamentoDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439011', description: 'ID do cliente' })
  @IsString()
  @IsNotEmpty()
  clientId: string;

  @ApiProperty({ example: 'Consulta Jurídica', description: 'Título do agendamento' })
  @IsString()
  @IsNotEmpty()
  titulo: string;

  @ApiProperty({ 
    example: 'Discussão sobre abertura de processo', 
    description: 'Descrição do agendamento',
    required: false 
  })
  @IsString()
  @IsOptional()
  descricao?: string;

  @ApiProperty({ example: '2025-10-25T14:30:00.000Z', description: 'Data e hora do agendamento' })
  @IsDateString()
  @IsNotEmpty()
  dataHora: string;

  @ApiProperty({ 
    example: 'Escritório - Sala 2', 
    description: 'Local da reunião',
    required: false 
  })
  @IsString()
  @IsOptional()
  local?: string;

  @ApiProperty({ 
    example: 'https://meet.google.com/abc-defg-hij', 
    description: 'Link da reunião online (Teams, Google Meet, etc)',
    required: false 
  })
  @IsString()
  @IsOptional()
  link?: string;
}
