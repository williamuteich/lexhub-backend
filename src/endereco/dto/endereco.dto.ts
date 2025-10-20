import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class EnderecoDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  clientId: string;

  @ApiProperty()
  bairro: string;

  @ApiProperty()
  endereco: string;

  @ApiProperty()
  numero: string;

  @ApiPropertyOptional({ nullable: true })
  complemento?: string | null;

  @ApiProperty()
  estado: string;

  @ApiProperty()
  cidade: string;

  @ApiProperty()
  cep: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
