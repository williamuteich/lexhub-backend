import { 
  Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query
} from '@nestjs/common';
import { ClientService } from './client.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { ClientDto } from './dto/client.dto';
import { 
  ApiBearerAuth, ApiOkResponse, ApiOperation, ApiQuery, ApiTags 
} from '@nestjs/swagger';
import { LongThrottle } from 'src/common/throttle/throttle.decorators';
import { AuthTokenGuard } from 'src/auth/guard/auth-token.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { Role } from '@prisma/client';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Controller('client')
@ApiTags('clients')
@LongThrottle()
@UseGuards(AuthTokenGuard, RolesGuard)
@Roles(Role.ADMIN, Role.COLLABORATOR)
@ApiBearerAuth()
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Get()
  @ApiQuery({ name: 'limit', required: false, example: 10, description: 'Limit of Clients to return' })
  @ApiQuery({ name: 'offset', required: false, example: 0, description: 'Offset of Clients to return' })
  @ApiOperation({ summary: 'Get all Clients', description: 'Returns all registered Clients' })
  @ApiOkResponse({ description: 'List of Clients', type: ClientDto, isArray: true })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.clientService.findAll(paginationDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a Client by ID' })
  @ApiOkResponse({ description: 'Client found', type: ClientDto })
  findOne(@Param('id') id: string) {
    return this.clientService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a Client', description: 'Registers a new client in the system' })
  @ApiOkResponse({ description: 'Client successfully created', type: CreateClientDto })
  create(@Body() createClientDto: CreateClientDto) {
    return this.clientService.create(createClientDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a Client by ID' })
  @ApiOkResponse({ description: 'Client updated successfully', type: UpdateClientDto })
  update(@Param('id') id: string, @Body() updateClientDto: UpdateClientDto) {
    return this.clientService.update(id, updateClientDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Delete a Client by ID' })
  @ApiOkResponse({ description: 'Client removed successfully' })
  remove(@Param('id') id: string) {
    return this.clientService.remove(id);
  }
}
