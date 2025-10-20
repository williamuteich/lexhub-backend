import { ApiProperty } from '@nestjs/swagger';

export class ClientDto {
  @ApiProperty({
    description: 'Client unique identifier',
    example: '507f1f77bcf86cd799439011',
  })
  id: string;

  @ApiProperty({
    description: 'Client full name',
    example: 'João Silva',
  })
  name: string;

  @ApiProperty({
    description: 'Client email address',
    example: 'joao.silva@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'Client avatar URL',
    example: 'https://example.com/avatar.jpg',
    required: false,
    nullable: true,
  })
  avatar: string | null;

  @ApiProperty({
    description: 'Client CPF',
    example: '123.456.789-00',
  })
  cpf: string;

  @ApiProperty({
    description: 'Client phone number',
    example: '(11) 98765-4321',
  })
  phone: string;

  @ApiProperty({
    description: 'Client birth date',
    example: '1990-01-15',
  })
  birthDate: string;

  @ApiProperty({
    description: 'Client sex/gender',
    example: 'M',
  })
  sex: string;

  @ApiProperty({
    description: 'Client account status',
    example: true,
  })
  status: boolean;

  @ApiProperty({
    description: 'Client creation timestamp',
    example: '2024-01-15T10:30:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Client last update timestamp',
    example: '2024-01-15T10:30:00.000Z',
  })
  updatedAt: Date;
}
