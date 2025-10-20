import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { 
  IsBoolean, 
  IsDateString, 
  IsEmail,
  IsEnum, 
  IsNotEmpty, 
  IsOptional, 
  IsString, 
  MinLength 
} from "class-validator";
import { Role } from "@prisma/client";

export class CreateClientDto {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'user@example.com', format: 'email' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ type: String, nullable: true, example: null, required: false })
  @IsString()
  @IsOptional()
  avatar?: string;

  @ApiProperty({ example: 'secret123', minLength: 6 })
  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  password: string;

  @ApiProperty({ example: '88899944433' })
  @IsString()
  @IsNotEmpty()
  cpf: string;

  @ApiProperty({ example: '88899944433' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ example: '1999-01-01' })
  @IsDateString()
  @IsNotEmpty()
  birthDate: string;

  @ApiProperty({ example: 'm' })
  @IsString()
  @IsNotEmpty()
  sex: string;

  @ApiPropertyOptional({ enum: Role, example: Role.CLIENT })
  @IsEnum(Role)
  @IsOptional()
  role?: Role;
}
