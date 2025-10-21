import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { DocumentDto } from './dto/document.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { StorageService } from 'src/storage/storage.service';

@Injectable()
export class DocumentService {
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
  ) {}

  async findOne(id: string): Promise<DocumentDto> {
    try {
      const document = await this.prisma.document.findUnique({
        where: { id },
        select: this.selectDocument
      })

      if (!document) {
        throw new HttpException('Document not found', HttpStatus.NOT_FOUND);
      }

      return document
    } catch (error) {
      if (error instanceof Error) {
        console.error(error);
      }
      throw new HttpException('Failed to fetch document', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async create(clientId: string, name: string, file: Express.Multer.File): Promise<{ message: string; document: DocumentDto }> {
    try {
      const clientExists = await this.prisma.client.findUnique({ 
        where: { id: clientId } 
      });
      
      if (!clientExists) {
        throw new HttpException('Client not found', HttpStatus.NOT_FOUND);
      }

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

      return { message: 'Document uploaded successfully', document };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.error(error);
      throw new HttpException('Failed to create document', HttpStatus.INTERNAL_SERVER_ERROR);
    }   
  }

  async update(id: string, updateDocumentDto: UpdateDocumentDto): Promise<{ message: string; document: DocumentDto }> {
    try {
      const document = await this.prisma.document.findUnique({ where: { id } });
      
      if (!document) {
        throw new HttpException('Document not found', HttpStatus.NOT_FOUND);
      }

      const updatedDocument = await this.prisma.document.update({
        where: { id },
        data: updateDocumentDto,
        select: this.selectDocument,
      });

      return { message: 'Document updated successfully', document: updatedDocument };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.error(error);
      throw new HttpException('Failed to update document', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    try {
      const document = await this.prisma.document.findUnique({ where: { id } });
      
      if (!document) {
        throw new HttpException('Document not found', HttpStatus.NOT_FOUND);
      }

      await this.storageService.deleteFile(document.fileKey);

      await this.prisma.document.delete({ where: { id } });

      return { message: 'Document deleted successfully' };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.error(error);
      throw new HttpException('Failed to delete document', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
