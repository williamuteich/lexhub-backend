import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { DocumentDto } from './dto/document.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { StorageService } from 'src/storage/storage.service';
import { EntityExistsValidator } from 'src/common/validators/entity-exists.validator';
import { MESSAGES } from 'src/common/constants/messages.constant';

@Injectable()
export class DocumentService {
  private readonly ALLOWED_DOCUMENT_TYPES = [
    'application/pdf',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];

  private readonly selectDocument = {
    id: true,
    clientId: true,
    name: true,
    fileUrl: true,
    fileKey: true,
    fileSize: true,
    mimeType: true,
    createdAt: true,
    updatedAt: true,
    client: {
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        status: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      }
    }
  };

  constructor(
    private readonly prisma: PrismaService,
    private readonly storageService: StorageService,
    private readonly validator: EntityExistsValidator,
  ) {}

  async findOne(id: string): Promise<DocumentDto> {
    const document = await this.prisma.document.findUnique({
      where: { id },
      select: this.selectDocument
    });

    if (!document) {
      throw new HttpException(MESSAGES.NOT_FOUND.DOCUMENT, HttpStatus.NOT_FOUND);
    }

    return document;
  }

  async create(clientId: string, name: string, file: Express.Multer.File): Promise<{ message: string; document: DocumentDto }> {
    if (!this.ALLOWED_DOCUMENT_TYPES.includes(file.mimetype)) {
      throw new HttpException(
        `Invalid file type. Allowed types: ${this.ALLOWED_DOCUMENT_TYPES.join(', ')}`,
        HttpStatus.BAD_REQUEST
      );
    }

    await this.validator.validateClientExists(clientId);

    const uploadResult = await this.storageService.uploadFile(file, 'documents');

    const document = await this.prisma.document.create({
      data: {
        clientId,
        name,
        fileUrl: uploadResult.url,
        fileKey: uploadResult.key,
        fileSize: file.size,
        mimeType: file.mimetype,
      },
      select: this.selectDocument
    });

    return { message: MESSAGES.SUCCESS.CREATED('Document'), document };
  }

  async update(id: string, updateDocumentDto: UpdateDocumentDto): Promise<{ message: string; document: DocumentDto }> {
    const document = await this.prisma.document.findUnique({ where: { id } });
    
    if (!document) {
      throw new HttpException(MESSAGES.NOT_FOUND.DOCUMENT, HttpStatus.NOT_FOUND);
    }

    const updatedDocument = await this.prisma.document.update({
      where: { id },
      data: updateDocumentDto,
      select: this.selectDocument,
    });

    return { message: MESSAGES.SUCCESS.UPDATED('Document'), document: updatedDocument };
  }

  async remove(id: string): Promise<{ message: string }> {
    const document = await this.prisma.document.findUnique({ where: { id } });
    
    if (!document) {
      throw new HttpException(MESSAGES.NOT_FOUND.DOCUMENT, HttpStatus.NOT_FOUND);
    }

    await this.storageService.deleteFile(document.fileKey);
    await this.prisma.document.delete({ where: { id } });

    return { message: MESSAGES.SUCCESS.DELETED('Document') };
  }
}
