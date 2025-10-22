import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateDocumentDto {
  @ApiProperty({ 
    example: 'RG', 
    description: 'Document name/title' 
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}
