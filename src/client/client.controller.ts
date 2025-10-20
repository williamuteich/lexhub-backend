import { 
  Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query
} from '@nestjs/common';
import { TokenPayload } from 'src/auth/decorator/token-payload.decorator';
import { PayloadTokenDto } from 'src/auth/config/payload-token-dto';
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
@ApiBearerAuth()
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Get()
  @Roles(Role.ADMIN, Role.COLLABORATOR)
  @ApiQuery({ name: 'limit', required: false, example: 10, description: 'Limit of Clients to return' })
  @ApiQuery({ name: 'offset', required: false, example: 0, description: 'Offset of Clients to return' })
  @ApiOperation({ summary: 'Get all Clients', description: 'Returns all registered Clients' })
  @ApiOkResponse({ description: 'List of Clients', type: ClientDto, isArray: true })
  findAll(@Query() paginationDto: PaginationDto): Promise<ClientDto[]> {
    return this.clientService.findAll(paginationDto);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.COLLABORATOR, Role.CLIENT)
  @ApiOperation({ summary: 'Get a Client by ID' })
  @ApiOkResponse({ description: 'Client found', type: ClientDto })
  findOne(@Param('id') id: string, @TokenPayload() payloadTokenDto: PayloadTokenDto): Promise<ClientDto> {
    return this.clientService.findOne(id, payloadTokenDto);
  }

  @Post()
  @Roles(Role.ADMIN, Role.COLLABORATOR)
  @ApiOperation({ summary: 'Create a Client', description: 'Registers a new client in the system' })
  @ApiOkResponse({ description: 'Client successfully created', type: CreateClientDto })
  create(@Body() createClientDto: CreateClientDto): Promise<{ message: string; client: ClientDto }> {
    return this.clientService.create(createClientDto);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.COLLABORATOR, Role.CLIENT)
  @ApiOperation({ summary: 'Update a Client by ID' })
  @ApiOkResponse({ description: 'Client updated successfully', type: UpdateClientDto })
  update(@Param('id') id: string, @Body() updateClientDto: UpdateClientDto, @TokenPayload() payloadTokenDto: PayloadTokenDto): Promise<{ message: string; client: ClientDto }> {
    return this.clientService.update(id, updateClientDto, payloadTokenDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Delete a Client by ID' })
  @ApiOkResponse({ description: 'Client removed successfully' })
  remove(@Param('id') id: string): Promise<{ message: string }> {
    return this.clientService.remove(id);
  }
}
