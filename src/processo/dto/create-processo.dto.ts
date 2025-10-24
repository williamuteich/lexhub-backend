import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { ProcessoStatus, TipoProcesso } from "@prisma/client";
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateProcessoDto {
    @ApiProperty({ 
        description: 'Process number',
        example: 123456789 
    })
    @IsNumber()
    @IsNotEmpty()
    numeroProcesso: number;

    @ApiProperty({ 
        description: 'Process type',
        example: 'CIVEL',
        enum: TipoProcesso
    })
    @IsNotEmpty()
    @IsEnum(TipoProcesso)
    tipo: TipoProcesso;

    @ApiPropertyOptional({ 
        description: 'Judiciary',
        example: 'Tribunal de Justiça do Estado de Minas Gerais'
    })
    @IsOptional()
    @IsString()
    tribunal?: string;

    @ApiPropertyOptional({ 
        description: 'Process status',
        example: 'ATIVO',
        enum: ProcessoStatus,
        default: 'ATIVO'
    })
    @IsOptional()
    @IsEnum(ProcessoStatus)
    status?: ProcessoStatus;

    @ApiProperty({ 
        description: 'Client ID (who opened the process)',
        example: '507f1f77bcf86cd799439011' 
    })
    @IsNotEmpty()
    @IsString()
    clientId: string;

    @ApiProperty({ 
        description: 'Responsible lawyer ID',
        example: '507f1f77bcf86cd799439011' 
    })
    @IsNotEmpty()
    @IsString()
    responsavelId: string;

    @ApiProperty({ 
        description: 'Opposing party name',
        example: 'Empresa XYZ Ltda' 
    })
    @IsNotEmpty()
    @IsString()
    parteContraria: string;
}