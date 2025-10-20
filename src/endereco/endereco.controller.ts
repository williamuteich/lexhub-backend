import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { EnderecoService } from './endereco.service';
import { CreateEnderecoDto } from './dto/create-endereco.dto';
import { UpdateEnderecoDto } from './dto/update-endereco.dto';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LongThrottle } from 'src/common/throttle/throttle.decorators';
import { AuthTokenGuard } from 'src/auth/guard/auth-token.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { Role } from '@prisma/client';
import { TokenPayload } from 'src/auth/decorator/token-payload.decorator';
import { PayloadTokenDto } from 'src/auth/config/payload-token-dto';
import { EnderecoDto } from './dto/endereco.dto';

@Controller('endereco')
@ApiTags('enderecos')
@LongThrottle()
@UseGuards(AuthTokenGuard, RolesGuard)
@ApiBearerAuth()
export class EnderecoController {
  constructor(private readonly enderecoService: EnderecoService) {}

  @Get()
  @Roles(Role.ADMIN, Role.COLLABORATOR)
  @ApiOperation({ summary: 'Get all Enderecos', description: 'Returns all registered addresses' })
  @ApiOkResponse({ description: 'List of Enderecos', type: EnderecoDto, isArray: true })
  findAll(): Promise<EnderecoDto[]> {
    return this.enderecoService.findAll();
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.COLLABORATOR, Role.CLIENT)
  @ApiOperation({ summary: 'Get an Endereco by ID' })
  @ApiOkResponse({ description: 'Endereco found', type: EnderecoDto })
  findOne(@Param('id') id: string, @TokenPayload() payloadTokenDto: PayloadTokenDto): Promise<EnderecoDto> {
    return this.enderecoService.findOne(id, payloadTokenDto);
  }

  @Post(':clientId')
  @Roles(Role.ADMIN, Role.COLLABORATOR)
  @ApiOperation({ summary: 'Create an Endereco for a Client', description: 'Creates a new address for a client (only one per client)' })
  @ApiOkResponse({ description: 'Endereco successfully created', type: EnderecoDto })
  create(@Param('clientId') clientId: string, @Body() createEnderecoDto: CreateEnderecoDto): Promise<{ message: string; endereco: EnderecoDto }> {
    return this.enderecoService.create(clientId, createEnderecoDto);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.COLLABORATOR, Role.CLIENT)
  @ApiOperation({ summary: 'Update an Endereco by ID' })
  @ApiOkResponse({ description: 'Endereco updated successfully', type: EnderecoDto })
  update(@Param('id') id: string, @Body() updateEnderecoDto: UpdateEnderecoDto, @TokenPayload() payloadTokenDto: PayloadTokenDto): Promise<{ message: string; endereco: EnderecoDto }> {
    return this.enderecoService.update(id, updateEnderecoDto, payloadTokenDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.COLLABORATOR)
  @ApiOperation({ summary: 'Delete an Endereco by ID' })
  @ApiOkResponse({ description: 'Endereco removed successfully' })
  remove(@Param('id') id: string): Promise<{ message: string }> {
    return this.enderecoService.remove(id);
  }
}
