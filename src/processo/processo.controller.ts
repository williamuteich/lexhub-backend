import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ProcessoService } from './processo.service';
import { CreateProcessoDto } from './dto/create-processo.dto';
import { UpdateProcessoDto } from './dto/update-processo.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ProcessoDto } from './dto/processo.dto';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiOkResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { AuthTokenGuard } from 'src/auth/guard/auth-token.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { Role } from '@prisma/client';
import { LongThrottle } from 'src/common/throttle/throttle.decorators';

@Controller('processo')
@ApiTags('processo')
@LongThrottle()
@UseGuards(AuthTokenGuard, RolesGuard)
@Roles(Role.ADMIN, Role.COLLABORATOR)
@ApiBearerAuth()
export class ProcessoController {
  constructor(private readonly processoService: ProcessoService) { }

  @Get()
  @ApiOperation({ summary: 'Get all processos', description: 'Returns all processos with pagination' })
  @ApiQuery({ name: 'limit', required: false, example: 10, description: 'Number of processos to return' })
  @ApiQuery({ name: 'offset', required: false, example: 0, description: 'Offset of processos to return' })
  @ApiOkResponse({ description: 'List of processos', type: ProcessoDto, isArray: true })
  findAll(@Query() paginationDto: PaginationDto): Promise<{ message: string; processo: ProcessoDto[] }> {
    return this.processoService.findAll(paginationDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a processo by ID' })
  @ApiParam({ name: 'id', type: String, description: 'Processo ID', example: '507f1f77bcf86cd799439011' })
  @ApiOkResponse({ description: 'Processo found', type: ProcessoDto })
  @ApiNotFoundResponse({ description: 'Processo not found' })
  findOne(@Param('id') id: string): Promise<{ message: string; processo: ProcessoDto }> {
    return this.processoService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new processo', description: 'Creates a new processo' })
  @ApiCreatedResponse({ description: 'Processo successfully created', type: ProcessoDto })
  @ApiNotFoundResponse({ description: 'Client or Lawyer not found' })
  create(@Body() createProcessoDto: CreateProcessoDto): Promise<{ message: string; processo: ProcessoDto }> {
    return this.processoService.create(createProcessoDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a processo by ID' })
  @ApiParam({ name: 'id', type: String, description: 'Processo ID', example: '507f1f77bcf86cd799439011' })
  @ApiOkResponse({ description: 'Processo updated successfully', type: ProcessoDto })
  @ApiNotFoundResponse({ description: 'Processo not found' })
  update(@Param('id') id: string, @Body() updateProcessoDto: UpdateProcessoDto): Promise<{ message: string; processo: ProcessoDto }> {
    return this.processoService.update(id, updateProcessoDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a processo by ID' })
  @ApiParam({ name: 'id', type: String, description: 'Processo ID', example: '507f1f77bcf86cd799439011' })
  @ApiOkResponse({ description: 'Processo deleted successfully' })
  @ApiNotFoundResponse({ description: 'Processo not found' })
  remove(@Param('id') id: string): Promise<{ message: string }> {
    return this.processoService.remove(id);
  }
}
