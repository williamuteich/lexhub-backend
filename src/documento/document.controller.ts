import { 
  Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UploadedFile, HttpException, HttpStatus 
} from '@nestjs/common';
import { DocumentService } from './document.service';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { AuthTokenGuard } from 'src/auth/guard/auth-token.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { 
  ApiBearerAuth, 
  ApiTags, 
  ApiOperation, 
  ApiOkResponse, 
  ApiParam, 
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiBody
} from '@nestjs/swagger';
import { LongThrottle } from 'src/common/throttle/throttle.decorators';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { Role } from '@prisma/client';
import { FileValidationPipe } from 'src/common/pipes/file-validation.pipe';
import { UploadFile } from 'src/common/decorators/upload-file.decorator';
import { DocumentDto } from './dto/document.dto';
import { CreateDocumentDto } from './dto/create-document.dto';

@Controller('document')
@ApiTags('document')
@LongThrottle()
@UseGuards(AuthTokenGuard, RolesGuard)
@Roles(Role.ADMIN, Role.COLLABORATOR)
@ApiBearerAuth()
export class DocumentController {
  constructor(private readonly documentService: DocumentService) { }

  @Get('client/:clientId')
  @ApiOperation({ summary: 'Get all documents by client', description: 'Returns all documents for a specific client' })
  @ApiParam({ name: 'clientId', type: String, description: 'Client ID', example: '507f1f77bcf86cd799439011' })
  @ApiOkResponse({ description: 'List of documents for client', type: DocumentDto, isArray: true })
  @ApiNotFoundResponse({ description: 'Client not found' })
  findByClient(@Param('clientId') clientId: string): Promise<{ message: string; documents: DocumentDto[] }> {
    return this.documentService.findByClient(clientId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a document by ID' })
  @ApiParam({ name: 'id', type: String, description: 'Document ID', example: '507f1f77bcf86cd799439011' })
  @ApiOkResponse({ description: 'Document found', type: DocumentDto })
  @ApiNotFoundResponse({ description: 'Document not found' })
  findOne(@Param('id') id: string): Promise<{ message: string; document: DocumentDto }> {
    return this.documentService.findOne(id);
  }

  @Post(':clientId')
  @UploadFile({
    name: { type: 'string', description: 'Document name/title', example: 'RG' },
  })
  @ApiOperation({ 
    summary: 'Upload a document for a client', 
    description: 'Upload a document file to R2 and save metadata. Send as multipart/form-data with key "file" for the file and other fields as form fields.' 
  })
  @ApiParam({ name: 'clientId', type: String, description: 'Client ID', example: '507f1f77bcf86cd799439011' })
  @ApiCreatedResponse({ description: 'Document successfully created' })
  async create(
    @Param('clientId') clientId: string,
    @Body() body: CreateDocumentDto,
    @UploadedFile(new FileValidationPipe()) file: Express.Multer.File,
  ) {
    return this.documentService.create(clientId, body.name, file);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a document by ID' })
  @ApiParam({ name: 'id', type: String, description: 'Document ID', example: '507f1f77bcf86cd799439011' })
  @ApiBody({ type: UpdateDocumentDto })
  @ApiOkResponse({ description: 'Document updated successfully' })
  @ApiNotFoundResponse({ description: 'Document not found' })
  update(@Param('id') id: string, @Body() updateDocumentDto: UpdateDocumentDto): Promise<{ message: string; document: DocumentDto }> {
    return this.documentService.update(id, updateDocumentDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a document by ID' })
  @ApiParam({ name: 'id', type: String, description: 'Document ID', example: '507f1f77bcf86cd799439011' })
  @ApiOkResponse({ description: 'Document deleted successfully' })
  @ApiNotFoundResponse({ description: 'Document not found' })
  remove(@Param('id') id: string): Promise<{ message: string }> {
    return this.documentService.remove(id);
  }
}
