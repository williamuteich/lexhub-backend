import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, UploadedFile } from '@nestjs/common';
import { DocumentoProcessoService } from './documento-processo.service';
import { CreateDocumentoProcessoDto } from './dto/create-documento-processo.dto';
import { UpdateDocumentoProcessoDto } from './dto/update-documento-processo.dto';
import { DocumentoProcessoDto } from './dto/documento-processo.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiOkResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiParam, ApiQuery, ApiBody } from '@nestjs/swagger';
import { AuthTokenGuard } from 'src/auth/guard/auth-token.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { Role } from '@prisma/client';
import { UploadFile } from 'src/common/decorators/upload-file.decorator';
import { FileValidationPipe } from 'src/common/pipes/file-validation.pipe';

@Controller('documento-processo')
@ApiTags('documento-processo')
@UseGuards(AuthTokenGuard, RolesGuard)
@Roles(Role.ADMIN, Role.COLLABORATOR)
@ApiBearerAuth()
export class DocumentoProcessoController {
  constructor(private readonly documentoProcessoService: DocumentoProcessoService) { }

  @Get()
  @ApiOperation({ summary: 'Get all documentos', description: 'Returns all documentos with pagination' })
  @ApiQuery({ name: 'limit', required: false, example: 10, description: 'Number of documentos to return' })
  @ApiQuery({ name: 'offset', required: false, example: 0, description: 'Offset of documentos to return' })
  @ApiOkResponse({ description: 'List of documentos', type: DocumentoProcessoDto, isArray: true })
  findAll(@Query() paginationDto: PaginationDto): Promise<{ message: string; documentos: DocumentoProcessoDto[] }> {
    return this.documentoProcessoService.findAll(paginationDto);
  }

  @Get('processo/:processoId')
  @ApiOperation({ summary: 'Get all documentos by processo', description: 'Returns all documentos of a specific processo with pagination' })
  @ApiParam({ name: 'processoId', type: String, description: 'Processo ID', example: '507f1f77bcf86cd799439011' })
  @ApiQuery({ name: 'limit', required: false, example: 10, description: 'Number of documentos to return' })
  @ApiQuery({ name: 'offset', required: false, example: 0, description: 'Offset of documentos to return' })
  @ApiOkResponse({ description: 'List of documentos', type: DocumentoProcessoDto, isArray: true })
  findAllByProcesso(@Param('processoId') processoId: string, @Query() paginationDto: PaginationDto): Promise<{ message: string; documentos: DocumentoProcessoDto[] }> {
    return this.documentoProcessoService.findAllByProcesso(processoId, paginationDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a documento by ID' })
  @ApiParam({ name: 'id', type: String, description: 'Documento ID', example: '507f1f77bcf86cd799439011' })
  @ApiOkResponse({ description: 'Documento found', type: DocumentoProcessoDto })
  @ApiNotFoundResponse({ description: 'Documento not found' })
  findOne(@Param('id') id: string): Promise<{ message: string; documento: DocumentoProcessoDto }> {
    return this.documentoProcessoService.findOne(id);
  }

  @Post(':processoId')
  @UploadFile({
    nome: { type: 'string', description: 'Nome do documento', example: 'Petição Inicial' },
    descricao: { type: 'string', description: 'Descrição do documento', example: 'Petição inicial do processo', required: false },
    tipo: { type: 'string', enum: ['PETICAO', 'SENTENCA', 'DESPACHO', 'CONTRATO', 'PROCURACAO', 'OUTRO'], description: 'Tipo do documento', example: 'PETICAO', required: false },
  })
  @ApiOperation({ 
    summary: 'Upload a documento for a processo', 
    description: 'Upload a documento file to R2 and save metadata. Send as multipart/form-data with key "file" for the file and other fields as form fields.' 
  })
  @ApiParam({ name: 'processoId', type: String, description: 'Processo ID', example: '507f1f77bcf86cd799439011' })
  @ApiCreatedResponse({ description: 'Documento successfully created', type: DocumentoProcessoDto })
  @ApiNotFoundResponse({ description: 'Processo not found' })
  create(
    @Param('processoId') processoId: string,
    @Body() createDocumentoProcessoDto: CreateDocumentoProcessoDto,
    @UploadedFile(new FileValidationPipe()) file: Express.Multer.File,
  ): Promise<{ message: string; documento: DocumentoProcessoDto }> {
    return this.documentoProcessoService.create(processoId, createDocumentoProcessoDto, file);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a documento by ID' })
  @ApiParam({ name: 'id', type: String, description: 'Documento ID', example: '507f1f77bcf86cd799439011' })
  @ApiBody({ type: UpdateDocumentoProcessoDto })
  @ApiOkResponse({ description: 'Documento updated successfully', type: DocumentoProcessoDto })
  @ApiNotFoundResponse({ description: 'Documento not found' })
  update(@Param('id') id: string, @Body() updateDocumentoProcessoDto: UpdateDocumentoProcessoDto): Promise<{ message: string; documento: DocumentoProcessoDto }> {
    return this.documentoProcessoService.update(id, updateDocumentoProcessoDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Delete a documento by ID' })
  @ApiParam({ name: 'id', type: String, description: 'Documento ID', example: '507f1f77bcf86cd799439011' })
  @ApiOkResponse({ description: 'Documento deleted successfully' })
  @ApiNotFoundResponse({ description: 'Documento not found' })
  remove(@Param('id') id: string): Promise<{ message: string }> {
    return this.documentoProcessoService.remove(id);
  }
}
