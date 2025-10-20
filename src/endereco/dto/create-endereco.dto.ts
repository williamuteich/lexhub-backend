import { IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateEnderecoDto {
  @ApiProperty({ example: '91450345', description: 'CEP with 8 digits (without dash)' })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.replace(/\D/g, ''))
  @Matches(/^\d{8}$/, { message: 'CEP must have 8 digits' })
  cep: string;

  @ApiProperty({ example: '123' })
  @IsString()
  @IsNotEmpty()
  numero: string;

  @ApiPropertyOptional({ example: 'Apto 101', nullable: true })
  @IsString()
  @IsOptional()
  complemento?: string;
}
