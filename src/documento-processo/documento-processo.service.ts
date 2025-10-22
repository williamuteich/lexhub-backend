import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateDocumentoProcessoDto } from './dto/create-documento-processo.dto';
import { UpdateDocumentoProcessoDto } from './dto/update-documento-processo.dto';
import { DocumentoProcessoDto } from './dto/documento-processo.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { StorageService } from 'src/storage/storage.service';
import { EntityExistsValidator } from 'src/common/validators/entity-exists.validator';
import { MESSAGES } from 'src/common/constants/messages.constant';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class DocumentoProcessoService {
  private readonly ALLOWED_DOCUMENT_TYPES = [
    'application/pdf',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];

  private readonly selectDocumento = {
    id: true,
    processoId: true,
    nome: true,
    descricao: true,
    tipo: true,
    fileUrl: true,
    fileKey: true,
    fileSize: true,
    mimeType: true,
    createdAt: true,
    updatedAt: true,
  };

  constructor(
    private readonly prisma: PrismaService,
    private readonly storageService: StorageService,
    private readonly validator: EntityExistsValidator,
  ) {}

  async findAll(paginationDto: PaginationDto): Promise<{ message: string; documentos: DocumentoProcessoDto[] }> {
    const { limit: take, offset: skip } = paginationDto;

    const documentos = await this.prisma.documentoProcesso.findMany({
      take,
      skip,
      select: this.selectDocumento,
    });

    return { message: MESSAGES.SUCCESS.RETRIEVED('Documentos'), documentos };
  }

  async findAllByProcesso(processoId: string, paginationDto: PaginationDto): Promise<{ message: string; documentos: DocumentoProcessoDto[] }> {
    await this.validator.validateProcessoExists(processoId);

    const { limit: take, offset: skip } = paginationDto;

    const documentos = await this.prisma.documentoProcesso.findMany({
      where: { processoId },
      take,
      skip,
      select: this.selectDocumento,
    });

    return { message: MESSAGES.SUCCESS.RETRIEVED('Documentos'), documentos };
  }

  async findOne(id: string): Promise<{ message: string; documento: DocumentoProcessoDto }> {
    const documento = await this.prisma.documentoProcesso.findUnique({
      where: { id },
      select: this.selectDocumento,
    });

    if (!documento) {
      throw new HttpException(MESSAGES.NOT_FOUND.DOCUMENT, HttpStatus.NOT_FOUND);
    }

    return { message: MESSAGES.SUCCESS.RETRIEVED('Documento'), documento };
  }

  async create(
    processoId: string,
    createDocumentoProcessoDto: CreateDocumentoProcessoDto,
    file: Express.Multer.File,
  ): Promise<{ message: string; documento: DocumentoProcessoDto }> {
    if (!this.ALLOWED_DOCUMENT_TYPES.includes(file.mimetype)) {
      throw new HttpException(
        `Invalid file type. Allowed types: ${this.ALLOWED_DOCUMENT_TYPES.join(', ')}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.validator.validateProcessoExists(processoId);

    const uploadResult = await this.storageService.uploadFile(file, 'documentos-processo');

    const documento = await this.prisma.documentoProcesso.create({
      data: {
        processoId,
        nome: createDocumentoProcessoDto.nome,
        descricao: createDocumentoProcessoDto.descricao,
        tipo: createDocumentoProcessoDto.tipo,
        fileUrl: uploadResult.url,
        fileKey: uploadResult.key,
        fileSize: file.size,
        mimeType: file.mimetype,
      },
      select: this.selectDocumento,
    });

    return { message: MESSAGES.SUCCESS.CREATED('Documento'), documento };
  }

  async update(id: string, updateDocumentoProcessoDto: UpdateDocumentoProcessoDto): Promise<{ message: string; documento: DocumentoProcessoDto }> {
    const documento = await this.prisma.documentoProcesso.findUnique({ where: { id } });

    if (!documento) {
      throw new HttpException(MESSAGES.NOT_FOUND.DOCUMENT, HttpStatus.NOT_FOUND);
    }

    const updatedDocumento = await this.prisma.documentoProcesso.update({
      where: { id },
      data: updateDocumentoProcessoDto,
      select: this.selectDocumento,
    });

    return { message: MESSAGES.SUCCESS.UPDATED('Documento'), documento: updatedDocumento };
  }

  async remove(id: string): Promise<{ message: string }> {
    const documento = await this.prisma.documentoProcesso.findUnique({ where: { id } });

    if (!documento) {
      throw new HttpException(MESSAGES.NOT_FOUND.DOCUMENT, HttpStatus.NOT_FOUND);
    }

    await this.storageService.deleteFile(documento.fileKey);
    await this.prisma.documentoProcesso.delete({ where: { id } });

    return { message: MESSAGES.SUCCESS.DELETED('Documento') };
  }
}
