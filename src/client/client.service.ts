import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { ClientDto } from './dto/client.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { HashingServiceProtocol } from 'src/auth/hashingPassword/hashing.service';
import { PayloadTokenDto } from 'src/auth/config/payload-token-dto';
import { Role } from '@prisma/client';
import { StorageService } from 'src/storage/storage.service';
import { EntityExistsValidator } from 'src/common/validators/entity-exists.validator';
import { MESSAGES } from 'src/common/constants/messages.constant';

@Injectable()
export class ClientService {
  private readonly clientSelectBasic = {
    id: true,
    name: true,
    email: true,
    avatar: true,
    cpf: true,
    phone: true,
    birthDate: true,
    sex: true,
    role: true,
    status: true,
    createdAt: true,
    updatedAt: true,
  };

  private readonly clientSelectFull = {
    id: true,
    name: true,
    email: true,
    avatar: true,
    cpf: true,
    phone: true,
    birthDate: true,
    sex: true,
    role: true,
    status: true,
    endereco: true,
    document: true,
    processos: {
      select: {
        id: true,
        numeroProcesso: true,
        tipo: true,
        status: true,
        dataAbertura: true,
        responsavelId: true,
      }
    },
    createdAt: true,
    updatedAt: true,
  };

  constructor(
    private readonly prisma: PrismaService,
    private readonly hashingService: HashingServiceProtocol,
    private readonly storageService: StorageService,
    private readonly validator: EntityExistsValidator,
  ) { }

  async findAll(paginationDto: PaginationDto, search?: string): Promise<ClientDto[]> {
    const limit = paginationDto.limit ?? 10;
    const offset = paginationDto.offset ?? 0;

    if (search) {
      return await this.prisma.client.findMany({
        take: limit,
        skip: offset,
        where: {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
            { cpf: { contains: search, mode: 'insensitive' } },
            { phone: { contains: search, mode: 'insensitive' } },
          ],
        },
        select: this.clientSelectBasic
      });
    }

    return await this.prisma.client.findMany({
      take: limit,
      skip: offset,
      select: this.clientSelectBasic
    });
  }

  async findOne(id: string, payloadTokenDto: PayloadTokenDto): Promise<ClientDto> {
    const client = await this.prisma.client.findUnique({
      where: { id },
      select: this.clientSelectFull
    });

    if (!client) throw new HttpException(MESSAGES.NOT_FOUND.CLIENT, HttpStatus.NOT_FOUND);

    if (payloadTokenDto.role === Role.CLIENT && payloadTokenDto.sub !== id) {
      throw new HttpException(MESSAGES.FORBIDDEN.VIEW_OWN_DATA, HttpStatus.FORBIDDEN);
    }

    return client;
  }

  async create(createClientDto: CreateClientDto): Promise<{ message: string; client: ClientDto }> {
    await this.validator.validateEmailNotInUse(createClientDto.email, 'client');

    const client = await this.prisma.client.create({
      data: createClientDto,
      select: this.clientSelectBasic
    });

    return { message: MESSAGES.SUCCESS.CREATED('Client'), client };
  }

  async update(id: string, updateClientDto: UpdateClientDto, payloadTokenDto: PayloadTokenDto): Promise<{ message: string; client: ClientDto }> {
    if (payloadTokenDto.role === Role.CLIENT && payloadTokenDto.sub !== id) {
      throw new HttpException(MESSAGES.FORBIDDEN.UPDATE_OWN_DATA, HttpStatus.FORBIDDEN);
    }

    const updatedData = { ...updateClientDto };
    if (updatedData.password) {
      updatedData.password = await this.hashingService.hash(updatedData.password);
    }

    if (payloadTokenDto.role === Role.CLIENT && updatedData.role) {
      throw new HttpException(MESSAGES.FORBIDDEN.CANNOT_CHANGE_ROLE, HttpStatus.FORBIDDEN);
    }

    const client = await this.prisma.client.update({
      where: { id },
      data: updatedData,
      select: this.clientSelectBasic
    });

    return { message: MESSAGES.SUCCESS.UPDATED('Client'), client };
  }

  async uploadAvatar(id: string, file: Express.Multer.File): Promise<{ message: string; client: ClientDto }> {
    await this.validator.validateClientExists(id);
    const existingClient = await this.prisma.client.findUnique({ where: { id } });

    try {
      if (existingClient?.avatar) {
        const oldKey = this.storageService.extractKeyFromUrl(existingClient.avatar);
        if (oldKey) await this.storageService.deleteFile(oldKey);
      }
    } catch (error) {
      console.warn('Failed to delete old avatar:', error);
    }

    const uploadResult = await this.storageService.uploadFile(file, 'avatars');

    const client = await this.prisma.client.update({
      where: { id },
      data: { avatar: uploadResult.url },
      select: this.clientSelectBasic,
    });

    return { message: MESSAGES.SUCCESS.UPDATED('Avatar'), client };
  }

  async remove(id: string): Promise<{ message: string }> {
    await this.validator.validateClientExists(id);

    await this.prisma.client.delete({ where: { id } });

    return { message: MESSAGES.SUCCESS.DELETED('Client') };
  }
}
