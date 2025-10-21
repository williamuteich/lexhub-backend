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

@Injectable()
export class ClientService {
  private readonly clientSelect = {
    id: true,
    name: true,
    email: true,
    avatar: true,
    cpf: true,
    phone: true,
    birthDate: true,
    sex: true,
    role: true,
    endereco: true,
    document: true,
    status: true,
    createdAt: true,
    updatedAt: true,
  };

  constructor(
    private readonly prisma: PrismaService,
    private readonly hashingService: HashingServiceProtocol,
    private readonly storageService: StorageService
  ) {}

  findAll(paginationDto: PaginationDto): Promise<ClientDto[]> {
    const { limit, offset } = paginationDto;
    const clients = this.prisma.client.findMany(
      {
        take: limit,
        skip: offset,
        select: this.clientSelect
      }
    )

    return clients;
  }

  async findOne(id: string, payloadTokenDto: PayloadTokenDto): Promise<ClientDto> {
    try {
      const client = await this.prisma.client.findUnique({
        where: { id },
        select: this.clientSelect
      });

      if (!client) throw new HttpException('Client not found', HttpStatus.NOT_FOUND);

      if (payloadTokenDto.role === Role.CLIENT && payloadTokenDto.sub !== id) {
        throw new HttpException('You can only view your own data', HttpStatus.FORBIDDEN);
      }

      return client;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.error(error);
      throw new HttpException('Failed to fetch client', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async create(createClientDto: CreateClientDto): Promise<{ message: string; client: ClientDto }> {
    try {
      const clientExist = await this.prisma.client.findUnique({ where: { email: createClientDto.email } });
      if (clientExist) throw new HttpException('Client already exists', HttpStatus.CONFLICT);

      const client = await this.prisma.client.create({
        data: createClientDto,
        select: this.clientSelect
      });

      return { message: 'Client created successfully', client };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.error(error);
      throw new HttpException('Failed to create client', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async update(id: string, updateClientDto: UpdateClientDto, payloadTokenDto: PayloadTokenDto): Promise<{ message: string; client: ClientDto }> {
    try {
      if (payloadTokenDto.role === Role.CLIENT && payloadTokenDto.sub !== id) {
        throw new HttpException('You can only update your own data', HttpStatus.FORBIDDEN);
      }

      const updatedData = { ...updateClientDto };
      if (updatedData.password) {
        updatedData.password = await this.hashingService.hash(updatedData.password);
      }

      if (payloadTokenDto.role === Role.CLIENT && updatedData.role) {
        throw new HttpException('You cannot change your own role', HttpStatus.FORBIDDEN);
      }

      const client = await this.prisma.client.update({
        where: { id },
        data: updatedData,
        select: this.clientSelect
      });

      return { message: 'Client updated successfully', client };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.error(error);
      throw new HttpException('Failed to update client', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async uploadAvatar(id: string, file: Express.Multer.File): Promise<{ message: string; client: ClientDto }> {
    try {
      const existingClient = await this.prisma.client.findUnique({ where: { id } });
      if (!existingClient) throw new HttpException('Client not found', HttpStatus.NOT_FOUND);

      if (existingClient.avatar) {
        const oldKey = this.storageService.extractKeyFromUrl(existingClient.avatar);
        if (oldKey) await this.storageService.deleteFile(oldKey);
      }

      const uploadResult = await this.storageService.uploadFile(file, 'avatars');

      const client = await this.prisma.client.update({
        where: { id },
        data: { avatar: uploadResult.url },
        select: this.clientSelect,
      });

      return { message: 'Avatar updated successfully', client };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.error(error);
      throw new HttpException('Failed to update avatar', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    try {
      const client = await this.prisma.client.findUnique({ where: { id } });
      if (!client) throw new HttpException('Client not found', HttpStatus.NOT_FOUND);

      await this.prisma.client.delete({ where: { id } });
      return { message: 'Client deleted successfully' };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.error(error);
      throw new HttpException('Failed to delete client', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
