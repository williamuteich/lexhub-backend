import { IsBoolean, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from "@prisma/client";

export class CreateUserDto {
    @ApiProperty({ example: 'John Doe' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: 'user@example.com', format: 'email' })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ example: 'secret123', minLength: 6 })
    @IsString()
    @MinLength(6)
    @IsNotEmpty()
    password: string;

    @ApiPropertyOptional({ type: String, nullable: true, example: null })
    @IsString()
    @IsOptional()
    avatar?: string;

    @ApiPropertyOptional({ 
        enum: Role, 
        example: Role.COLLABORATOR,
        description: 'User role'
    })
    @IsEnum(Role)
    @IsOptional()
    role?: Role;

    @ApiPropertyOptional({ 
        example: true,
        description: 'User active status'
    })
    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}