import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateEnderecoDto } from './dto/create-endereco.dto';
import { UpdateEnderecoDto } from './dto/update-endereco.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PayloadTokenDto } from 'src/auth/config/payload-token-dto';
import { Role } from '@prisma/client';
import { EnderecoDto } from './dto/endereco.dto';
import { ViaCepService } from 'src/viacep/viacep.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { EntityExistsValidator } from 'src/common/validators/entity-exists.validator';
import { MESSAGES } from 'src/common/constants/messages.constant';

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
    private readonly viaCepService: ViaCepService,
    private readonly validator: EntityExistsValidator,
  ) {}

  async findAll(paginationDto?: PaginationDto): Promise<EnderecoDto[]> {
    const { limit: take, offset: skip } = paginationDto || { limit: 100, offset: 0 };
    
    return await this.prisma.endereco.findMany({
      take,
      skip,
      select: this.enderecoSelect,
    });
  }

  async findOne(id: string, payloadTokenDto: PayloadTokenDto): Promise<EnderecoDto> {
    const endereco = await this.prisma.endereco.findUnique({
      where: { id },
      select: this.enderecoSelect,
    });

    if (!endereco) throw new HttpException(MESSAGES.NOT_FOUND.ENDERECO, HttpStatus.NOT_FOUND);

    if (payloadTokenDto.role !== Role.ADMIN && payloadTokenDto.role !== Role.COLLABORATOR && payloadTokenDto.sub !== endereco.clientId) {
      throw new HttpException(MESSAGES.FORBIDDEN.VIEW_OWN_ADDRESS, HttpStatus.FORBIDDEN);
    }

    return endereco;
  }

  async create(clientId: string, createEnderecoDto: CreateEnderecoDto): Promise<{ message: string; endereco: EnderecoDto }> {
    await this.validator.validateClientExists(clientId);

    const enderecoExists = await this.prisma.endereco.findFirst({ where: { clientId } });
    if (enderecoExists) throw new HttpException(MESSAGES.CONFLICT.ADDRESS_EXISTS, HttpStatus.CONFLICT);

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

    return { message: MESSAGES.SUCCESS.CREATED('Endereco'), endereco };
  }

  async update(id: string, updateEnderecoDto: UpdateEnderecoDto, payloadTokenDto: PayloadTokenDto): Promise<{ message: string; endereco: EnderecoDto }> {
    const endereco = await this.prisma.endereco.findUnique({ where: { id } });
    if (!endereco) throw new HttpException(MESSAGES.NOT_FOUND.ENDERECO, HttpStatus.NOT_FOUND);

    const hasRole = payloadTokenDto.role === Role.ADMIN || payloadTokenDto.role === Role.COLLABORATOR;
    const isOwner = payloadTokenDto.sub === endereco.clientId;

    if (!hasRole && !isOwner) {
      throw new HttpException(MESSAGES.FORBIDDEN.UPDATE_OWN_ADDRESS, HttpStatus.FORBIDDEN);
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

    return { message: MESSAGES.SUCCESS.UPDATED('Endereco'), endereco: updatedEndereco };
  }

  async remove(id: string): Promise<{ message: string }> {
    const endereco = await this.prisma.endereco.findUnique({ where: { id } });
    if (!endereco) throw new HttpException(MESSAGES.NOT_FOUND.ENDERECO, HttpStatus.NOT_FOUND);

    await this.prisma.endereco.delete({ where: { id } });
    
    return { message: MESSAGES.SUCCESS.DELETED('Endereco') };
  }
}
