import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  UseGuards, 
  UploadedFile,
  Query 
} from '@nestjs/common';
import { ClientBoletoService } from './client-boleto.service';
import { CreateClientBoletoDto } from './dto/create-client-boleto.dto';
import { UpdateClientBoletoDto } from './dto/update-client-boleto.dto';
import { BoletoDto } from './dto/boleto.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { 
  ApiBearerAuth, 
  ApiTags, 
  ApiOperation, 
  ApiOkResponse, 
  ApiParam, 
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiQuery
} from '@nestjs/swagger';
import { LongThrottle } from 'src/common/throttle/throttle.decorators';
import { AuthTokenGuard } from 'src/auth/guard/auth-token.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { Role } from '@prisma/client';
import { FileValidationPipe } from 'src/common/pipes/file-validation.pipe';
import { UploadFile } from 'src/common/decorators/upload-file.decorator';

@Controller('boleto')
@ApiTags('boleto')
@LongThrottle()
@UseGuards(AuthTokenGuard, RolesGuard)
@Roles(Role.ADMIN, Role.COLLABORATOR)
@ApiBearerAuth()
export class ClientBoletoController {
  constructor(private readonly clientBoletoService: ClientBoletoService) { }

  @Get()
  @ApiOperation({ summary: 'Get all boletos', description: 'Returns all boletos with pagination' })
  @ApiQuery({ name: 'limit', required: false, example: 10, description: 'Number of boletos to return' })
  @ApiQuery({ name: 'offset', required: false, example: 0, description: 'Offset of boletos to return' })
  @ApiOkResponse({ description: 'List of boletos', type: BoletoDto, isArray: true })
  findAll(@Query() paginationDto: PaginationDto): Promise<{ message: string; boletos: BoletoDto[] }> {
    return this.clientBoletoService.findAll(paginationDto);
  }

  @Get('client/:clientId')
  @ApiOperation({ summary: 'Get all boletos by client', description: 'Returns all boletos for a specific client with pagination' })
  @ApiParam({ name: 'clientId', type: String, description: 'Client ID', example: '507f1f77bcf86cd799439011' })
  @ApiQuery({ name: 'limit', required: false, example: 10, description: 'Number of boletos to return' })
  @ApiQuery({ name: 'offset', required: false, example: 0, description: 'Offset of boletos to return' })
  @ApiOkResponse({ description: 'List of boletos for client', type: BoletoDto, isArray: true })
  @ApiNotFoundResponse({ description: 'Client not found' })
  findByClient(@Param('clientId') clientId: string, @Query() paginationDto: PaginationDto): Promise<{ message: string; boletos: BoletoDto[] }> {
    return this.clientBoletoService.findByClient(clientId, paginationDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a boleto by ID' })
  @ApiParam({ name: 'id', type: String, description: 'Boleto ID', example: '507f1f77bcf86cd799439011' })
  @ApiOkResponse({ description: 'Boleto found', type: BoletoDto })
  @ApiNotFoundResponse({ description: 'Boleto not found' })
  findOne(@Param('id') id: string): Promise<{ message: string; boleto: BoletoDto }> {
    return this.clientBoletoService.findOne(id);
  }

  @Post(':clientId')
  @UploadFile({
    titulo: { type: 'string', description: 'Título do boleto', example: 'Pagamento de honorários' },
    observacao: { type: 'string', description: 'Observação', example: 'Referente a outubro/2025', required: false },
    dataVencimento: { type: 'string', description: 'Data de vencimento', example: '2025-10-25T00:00:00.000Z' },
  })
  @ApiOperation({ summary: 'Upload a boleto for a client', description: 'Upload a boleto file to R2 and save metadata' })
  @ApiParam({ name: 'clientId', type: String, description: 'Client ID', example: '507f1f77bcf86cd799439011' })
  @ApiCreatedResponse({ description: 'Boleto successfully created', type: BoletoDto })
  @ApiNotFoundResponse({ description: 'Client not found' })
  create(
    @Param('clientId') clientId: string,
    @Body() body: { titulo: string; observacao?: string; dataVencimento: string },
    @UploadedFile(new FileValidationPipe()) file: Express.Multer.File,
  ): Promise<{ message: string; boleto: BoletoDto }> {
    return this.clientBoletoService.create(
      clientId,
      body.titulo,
      body.dataVencimento,
      file,
      body.observacao
    );
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a boleto by ID' })
  @ApiParam({ name: 'id', type: String, description: 'Boleto ID', example: '507f1f77bcf86cd799439011' })
  @ApiOkResponse({ description: 'Boleto updated successfully', type: BoletoDto })
  @ApiNotFoundResponse({ description: 'Boleto not found' })
  update(@Param('id') id: string, @Body() updateClientBoletoDto: UpdateClientBoletoDto): Promise<{ message: string; boleto: BoletoDto }> {
    return this.clientBoletoService.update(id, updateClientBoletoDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a boleto by ID' })
  @ApiParam({ name: 'id', type: String, description: 'Boleto ID', example: '507f1f77bcf86cd799439011' })
  @ApiOkResponse({ description: 'Boleto deleted successfully' })
  @ApiNotFoundResponse({ description: 'Boleto not found' })
  remove(@Param('id') id: string): Promise<{ message: string }> {
    return this.clientBoletoService.remove(id);
  }
}
