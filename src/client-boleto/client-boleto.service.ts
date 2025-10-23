import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateClientBoletoDto } from './dto/create-client-boleto.dto';
import { UpdateClientBoletoDto } from './dto/update-client-boleto.dto';
import { BoletoDto } from './dto/boleto.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { StorageService } from 'src/storage/storage.service';
import { EntityExistsValidator } from 'src/common/validators/entity-exists.validator';
import { MESSAGES } from 'src/common/constants/messages.constant';

@Injectable()
export class ClientBoletoService {
  private readonly ALLOWED_DOCUMENT_TYPES = [
    'application/pdf',
    'image/jpeg',
    'image/jpg',
    'image/png',
  ];

  private readonly selectBoleto = {
    id: true,
    clientId: true,
    titulo: true,
    observacao: true,
    status: true,
    dataVencimento: true,
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

  async findAll(paginationDto: PaginationDto): Promise<{ message: string; boletos: BoletoDto[] }> {
    const { limit, offset } = paginationDto;
    const boletos = await this.prisma.boleto.findMany({
      take: limit,
      skip: offset,
      select: this.selectBoleto,
      orderBy: { dataVencimento: 'desc' },
    });

    return { 
      message: MESSAGES.SUCCESS.RETRIEVED('Boletos'), 
      boletos 
    };
  }

  async findByClient(clientId: string, paginationDto: PaginationDto): Promise<{ message: string; boletos: BoletoDto[] }> {
    await this.validator.validateClientExists(clientId);

    const { limit, offset } = paginationDto;
    const boletos = await this.prisma.boleto.findMany({
      where: { clientId },
      take: limit,
      skip: offset,
      select: this.selectBoleto,
      orderBy: { dataVencimento: 'desc' },
    });

    return { 
      message: MESSAGES.SUCCESS.RETRIEVED('Boletos'), 
      boletos 
    };
  }

  async findOne(id: string): Promise<{ message: string; boleto: BoletoDto }> {
    const boleto = await this.prisma.boleto.findUnique({
      where: { id },
      select: this.selectBoleto
    });

    if (!boleto) {
      throw new HttpException(MESSAGES.NOT_FOUND.BOLETO, HttpStatus.NOT_FOUND);
    }

    return { 
      message: MESSAGES.SUCCESS.RETRIEVED('Boleto'), 
      boleto 
    };
  }

  async create(
    clientId: string,
    titulo: string,
    dataVencimento: string,
    file: Express.Multer.File,
    observacao?: string
  ): Promise<{ message: string; boleto: BoletoDto }> {
    if (!this.ALLOWED_DOCUMENT_TYPES.includes(file.mimetype)) {
      throw new HttpException(
        `Invalid file type. Allowed types: ${this.ALLOWED_DOCUMENT_TYPES.join(', ')}`,
        HttpStatus.BAD_REQUEST
      );
    }

    await this.validator.validateClientExists(clientId);

    const uploadResult = await this.storageService.uploadFile(file, 'boletos');

    const boleto = await this.prisma.boleto.create({
      data: {
        clientId,
        titulo,
        observacao,
        dataVencimento: new Date(dataVencimento),
        fileUrl: uploadResult.url,
        fileKey: uploadResult.key,
        fileSize: file.size,
        mimeType: file.mimetype,
      },
      select: this.selectBoleto
    });

    return { 
      message: MESSAGES.SUCCESS.CREATED('Boleto'), 
      boleto 
    };
  }

  async update(id: string, updateClientBoletoDto: UpdateClientBoletoDto): Promise<{ message: string; boleto: BoletoDto }> {
    const boleto = await this.prisma.boleto.findUnique({ where: { id } });
    
    if (!boleto) {
      throw new HttpException(MESSAGES.NOT_FOUND.BOLETO, HttpStatus.NOT_FOUND);
    }

    const updateData: any = { ...updateClientBoletoDto };
    if (updateClientBoletoDto.dataVencimento) {
      updateData.dataVencimento = new Date(updateClientBoletoDto.dataVencimento);
    }

    const updatedBoleto = await this.prisma.boleto.update({
      where: { id },
      data: updateData,
      select: this.selectBoleto,
    });

    return { 
      message: MESSAGES.SUCCESS.UPDATED('Boleto'), 
      boleto: updatedBoleto 
    };
  }

  async remove(id: string): Promise<{ message: string }> {
    const boleto = await this.prisma.boleto.findUnique({ where: { id } });
    
    if (!boleto) {
      throw new HttpException(MESSAGES.NOT_FOUND.BOLETO, HttpStatus.NOT_FOUND);
    }

    await this.storageService.deleteFile(boleto.fileKey);
    await this.prisma.boleto.delete({ where: { id } });

    return { message: MESSAGES.SUCCESS.DELETED('Boleto') };
  }
}
