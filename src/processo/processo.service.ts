import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProcessoDto } from './dto/create-processo.dto';
import { UpdateProcessoDto } from './dto/update-processo.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ProcessoDto } from './dto/processo.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { EntityExistsValidator } from 'src/common/validators/entity-exists.validator';
import { MESSAGES } from 'src/common/constants/messages.constant';

@Injectable()
export class ProcessoService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly validator: EntityExistsValidator,
  ) { }

  private readonly selectProcessoBasic = {
    id: true,
    numeroProcesso: true,
    tipo: true,
    status: true,
    tribunal: true,
    dataAbertura: true,
    dataEncerramento: true,
    clientId: true,
    responsavelId: true,
    parteContraria: true,
    createdAt: true,
    updatedAt: true,
  };

  private readonly selectProcessoFull = {
    id: true,
    numeroProcesso: true,
    tipo: true,
    status: true,
    tribunal: true,
    dataAbertura: true,
    dataEncerramento: true,
    clientId: true,
    responsavelId: true,
    parteContraria: true,
    client: {
      select: {
        id: true,
        name: true,
        email: true,
        cpf: true,
        phone: true,
      }
    },
    responsavel: {
      select: {
        id: true,
        name: true,
        email: true,
        oab: true,
      }
    },
    documentos: {
      select: {
        id: true,
        nome: true,
        tipo: true,
        fileUrl: true,
        createdAt: true,
      }
    },
    createdAt: true,
    updatedAt: true,
  };

  async findAll(paginationDto: PaginationDto): Promise<{ message: string; processo: ProcessoDto[] }> {
    const { limit: take, offset: skip } = paginationDto;

    const processo = await this.prisma.processo.findMany({
      take,
      skip,
      select: this.selectProcessoBasic
    });

    return { message: MESSAGES.SUCCESS.RETRIEVED('Processos'), processo };
  }

  async findOne(id: string): Promise<{ message: string; processo: ProcessoDto }> {
    const processo = await this.prisma.processo.findUnique({
      where: { id },
      select: this.selectProcessoFull
    });

    if (!processo) {
      throw new HttpException(MESSAGES.NOT_FOUND.PROCESSO, HttpStatus.NOT_FOUND);
    }

    return { message: MESSAGES.SUCCESS.RETRIEVED('Processo'), processo };
  }
  async create(createProcessoDto: CreateProcessoDto): Promise<{ message: string; processo: ProcessoDto }> {
    const { numeroProcesso, tipo, status, tribunal, clientId, responsavelId, parteContraria } = createProcessoDto;

    await this.validator.validateProcessoNumberNotInUse(numeroProcesso);
    await this.validator.validateClientExists(clientId);
    await this.validator.validateUserExists(responsavelId);

    const processo = await this.prisma.processo.create({
      data: {
        numeroProcesso,
        tipo,
        status: status || 'ATIVO',
        tribunal,
        clientId,
        responsavelId,
        parteContraria
      },
      select: this.selectProcessoBasic
    });

    return { message: MESSAGES.SUCCESS.CREATED('Processo'), processo };
  }

  async update(id: string, updateProcessoDto: UpdateProcessoDto): Promise<{ message: string; processo: ProcessoDto }> {
    await this.validator.validateProcessoExists(id);

    if (updateProcessoDto.numeroProcesso) {
      await this.validator.validateProcessoNumberNotInUse(updateProcessoDto.numeroProcesso, id);
    }

    if (updateProcessoDto.clientId) {
      await this.validator.validateClientExists(updateProcessoDto.clientId);
    }

    if (updateProcessoDto.responsavelId) {
      await this.validator.validateUserExists(updateProcessoDto.responsavelId);
    }

    const processo = await this.prisma.processo.update({
      where: { id },
      data: updateProcessoDto,
      select: this.selectProcessoBasic
    });

    return { message: MESSAGES.SUCCESS.UPDATED('Processo'), processo };
  }

  async remove(id: string): Promise<{ message: string }> {
    await this.validator.validateProcessoExists(id);

    await this.prisma.processo.delete({
      where: { id }
    });

    return { message: MESSAGES.SUCCESS.DELETED('Processo') };
  }
}
