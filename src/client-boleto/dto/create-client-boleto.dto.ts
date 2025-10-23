import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateClientBoletoDto {
  @ApiProperty({
    example: '507f1f77bcf86cd799439011',
    description: 'ID do cliente'
  })
  @IsString()
  @IsNotEmpty()
  clientId: string;

  @ApiProperty({
    example: 'Pagamento de honorários - Processo 12345',
    description: 'Título do boleto'
  })
  @IsString()
  @IsNotEmpty()
  titulo: string;

  @ApiProperty({
    example: 'Referente aos serviços prestados em outubro/2025',
    description: 'Observação sobre o boleto',
    required: false
  })
  @IsString()
  @IsOptional()
  observacao?: string;

  @ApiProperty({
    example: '2025-10-25T00:00:00.000Z',
    description: 'Data de vencimento do boleto'
  })
  @IsDateString()
  @IsNotEmpty()
  dataVencimento: string;
}
