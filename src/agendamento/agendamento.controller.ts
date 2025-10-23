import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { AgendamentoService } from './agendamento.service';
import { CreateAgendamentoDto } from './dto/create-agendamento.dto';
import { UpdateAgendamentoDto } from './dto/update-agendamento.dto';
import { AgendamentoDto } from './dto/agendamento.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { 
  ApiBearerAuth, 
  ApiTags, 
  ApiOperation, 
  ApiOkResponse, 
  ApiNotFoundResponse, 
  ApiCreatedResponse,
  ApiParam,
  ApiQuery 
} from '@nestjs/swagger';
import { LongThrottle } from 'src/common/throttle/throttle.decorators';
import { AuthTokenGuard } from 'src/auth/guard/auth-token.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Role } from '@prisma/client';
import { Roles } from 'src/auth/decorator/roles.decorator';

@Controller('agendamento')
@ApiTags('agendamento')
@LongThrottle()
@UseGuards(AuthTokenGuard, RolesGuard)
@Roles(Role.ADMIN, Role.COLLABORATOR)
@ApiBearerAuth()
export class AgendamentoController {
  constructor(private readonly agendamentoService: AgendamentoService) { }

  @Get()
  @ApiOperation({ summary: 'Get all agendamentos', description: 'Returns all agendamentos with pagination' })
  @ApiQuery({ name: 'limit', required: false, example: 10, description: 'Number of agendamentos to return' })
  @ApiQuery({ name: 'offset', required: false, example: 0, description: 'Offset of agendamentos to return' })
  @ApiOkResponse({ description: 'List of agendamentos', type: AgendamentoDto, isArray: true })
  findAll(@Query() paginationDto: PaginationDto): Promise<{ message: string; agendamentos: AgendamentoDto[] }> {
    return this.agendamentoService.findAll(paginationDto);
  }

  @Get('client/:clientId')
  @ApiOperation({ summary: 'Get all agendamentos by client', description: 'Returns all agendamentos for a specific client with pagination' })
  @ApiParam({ name: 'clientId', type: String, description: 'Client ID', example: '507f1f77bcf86cd799439011' })
  @ApiQuery({ name: 'limit', required: false, example: 10, description: 'Number of agendamentos to return' })
  @ApiQuery({ name: 'offset', required: false, example: 0, description: 'Offset of agendamentos to return' })
  @ApiOkResponse({ description: 'List of agendamentos for client', type: AgendamentoDto, isArray: true })
  @ApiNotFoundResponse({ description: 'Client not found' })
  findByClient(@Param('clientId') clientId: string, @Query() paginationDto: PaginationDto): Promise<{ message: string; agendamentos: AgendamentoDto[] }> {
    return this.agendamentoService.findByClient(clientId, paginationDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an agendamento by ID' })
  @ApiParam({ name: 'id', type: String, description: 'Agendamento ID', example: '507f1f77bcf86cd799439011' })
  @ApiOkResponse({ description: 'Agendamento found', type: AgendamentoDto })
  @ApiNotFoundResponse({ description: 'Agendamento not found' })
  findOne(@Param('id') id: string): Promise<{ message: string; agendamento: AgendamentoDto }> {
    return this.agendamentoService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new agendamento', description: 'Creates a new agendamento for a client' })
  @ApiCreatedResponse({ description: 'Agendamento successfully created', type: AgendamentoDto })
  @ApiNotFoundResponse({ description: 'Client not found' })
  create(@Body() createAgendamentoDto: CreateAgendamentoDto): Promise<{ message: string; agendamento: AgendamentoDto }> {
    return this.agendamentoService.create(createAgendamentoDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an agendamento by ID' })
  @ApiParam({ name: 'id', type: String, description: 'Agendamento ID', example: '507f1f77bcf86cd799439011' })
  @ApiOkResponse({ description: 'Agendamento updated successfully', type: AgendamentoDto })
  @ApiNotFoundResponse({ description: 'Agendamento not found' })
  update(@Param('id') id: string, @Body() updateAgendamentoDto: UpdateAgendamentoDto): Promise<{ message: string; agendamento: AgendamentoDto }> {
    return this.agendamentoService.update(id, updateAgendamentoDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an agendamento by ID' })
  @ApiParam({ name: 'id', type: String, description: 'Agendamento ID', example: '507f1f77bcf86cd799439011' })
  @ApiOkResponse({ description: 'Agendamento deleted successfully' })
  @ApiNotFoundResponse({ description: 'Agendamento not found' })
  remove(@Param('id') id: string): Promise<{ message: string }> {
    return this.agendamentoService.remove(id);
  }
}
