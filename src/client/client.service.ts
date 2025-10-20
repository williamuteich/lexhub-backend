import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { ClientDto } from './dto/client.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { HashingServiceProtocol } from 'src/auth/hashingPassword/hashing.service';
import { PayloadTokenDto } from 'src/auth/config/payload-token-dto';
import { Role } from '@prisma/client';

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
    status: true,
    createdAt: true,
    updatedAt: true,
  };

  constructor(
    private readonly prisma: PrismaService,
    private readonly hashingService: HashingServiceProtocol
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

  async findOne(id: string, payloadTokenDto: PayloadTokenDto) {
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

  async create(createClientDto: CreateClientDto) {
    try {
      const clientExist = await this.prisma.client.findUnique({ where: { email: createClientDto.email } });
      if (clientExist) throw new HttpException('Client already exists', HttpStatus.BAD_REQUEST);

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

  async update(id: string, updateClientDto: UpdateClientDto, payloadTokenDto: PayloadTokenDto) {
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

  async remove(id: string) {
    try {
      await this.prisma.client.delete({ where: { id } });
      return { message: 'Client deleted successfully' };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.error(error);
      throw new HttpException('Failed to delete client', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
