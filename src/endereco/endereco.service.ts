import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateEnderecoDto } from './dto/create-endereco.dto';
import { UpdateEnderecoDto } from './dto/update-endereco.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PayloadTokenDto } from 'src/auth/config/payload-token-dto';
import { Role } from '@prisma/client';
import { EnderecoDto } from './dto/endereco.dto';
import { ViaCepService } from 'src/viacep/viacep.service';

@Injectable()
export class EnderecoService {
  private readonly enderecoSelect = {
    id: true,
    clientId: true,
    bairro: true,
    endereco: true,
    numero: true,
    complemento: true,
    estado: true,
    cidade: true,
    cep: true,
    createdAt: true,
    updatedAt: true,
  };

  constructor(
    private readonly prisma: PrismaService,
    private readonly viaCepService: ViaCepService
  ) {}

  async findAll(): Promise<EnderecoDto[]> {
    try {
      return await this.prisma.endereco.findMany({
        select: this.enderecoSelect,
      });
    } catch (error) {
      console.error(error);
      throw new HttpException('Failed to fetch enderecos', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findOne(id: string, payloadTokenDto: PayloadTokenDto): Promise<EnderecoDto> {
    try {
      const endereco = await this.prisma.endereco.findUnique({
        where: { id },
        select: this.enderecoSelect,
      });

      if (!endereco) throw new HttpException('Endereco not found', HttpStatus.NOT_FOUND);

      if (payloadTokenDto.role !== Role.ADMIN && payloadTokenDto.role !== Role.COLLABORATOR && payloadTokenDto.sub !== endereco.clientId) {
        throw new HttpException('You can only view your own address', HttpStatus.FORBIDDEN);
      }

      return endereco;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.error(error);
      throw new HttpException('Failed to fetch endereco', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async create(clientId: string, createEnderecoDto: CreateEnderecoDto): Promise<{ message: string; endereco: EnderecoDto }> {
    try {
      const clientExists = await this.prisma.client.findUnique({ where: { id: clientId } });
      if (!clientExists) throw new HttpException('Client not found', HttpStatus.NOT_FOUND);

      const enderecoExists = await this.prisma.endereco.findFirst({ where: { clientId } });
      if (enderecoExists) throw new HttpException('Client already has an address', HttpStatus.BAD_REQUEST);

      const dadosCep = await this.viaCepService.buscarCep(createEnderecoDto.cep);

      const endereco = await this.prisma.endereco.create({
        data: {
          clientId,
          cep: createEnderecoDto.cep,
          numero: createEnderecoDto.numero,
          complemento: createEnderecoDto.complemento,
          ...dadosCep,
        },
        select: this.enderecoSelect,
      });

      return { message: 'Endereco created successfully', endereco };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.error(error);
      throw new HttpException('Failed to create endereco', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async update(id: string, updateEnderecoDto: UpdateEnderecoDto, payloadTokenDto: PayloadTokenDto): Promise<{ message: string; endereco: EnderecoDto }> {
    try {
      const endereco = await this.prisma.endereco.findUnique({ where: { id } });
      if (!endereco) throw new HttpException('Endereco not found', HttpStatus.NOT_FOUND);

      const hasRole = payloadTokenDto.role === Role.ADMIN || payloadTokenDto.role === Role.COLLABORATOR;
      const isOwner = payloadTokenDto.sub === endereco.clientId;

      if (!hasRole && !isOwner) {
        throw new HttpException('You can only update your own address', HttpStatus.FORBIDDEN);
      }

      let dataToUpdate = { ...updateEnderecoDto };

      if (updateEnderecoDto.cep) {
        const dadosCep = await this.viaCepService.buscarCep(updateEnderecoDto.cep);
        dataToUpdate = { ...dataToUpdate, ...dadosCep };
      }

      const updatedEndereco = await this.prisma.endereco.update({
        where: { id },
        data: dataToUpdate,
        select: this.enderecoSelect,
      });

      return { message: 'Endereco updated successfully', endereco: updatedEndereco };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.error(error);
      throw new HttpException('Failed to update endereco', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    try {
      await this.prisma.endereco.delete({ where: { id } });
      return { message: 'Endereco deleted successfully' };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.error(error);
      throw new HttpException('Failed to delete endereco', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
