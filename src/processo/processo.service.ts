import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProcessoDto } from './dto/create-processo.dto';
import { UpdateProcessoDto } from './dto/update-processo.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ProcessoDto } from './dto/processo.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProcessoService {
  constructor(
    private readonly prisma: PrismaService,
  ){}

  private readonly selectProcesso = {
    id: true,
    numeroProcesso: true,
    tipo: true,
    status: true,
    dataAbertura: true,
    dataEncerramento: true,
    clientId: true,
    responsavelId: true,
    parteContraria: true,
    createdAt: true,
    updatedAt: true,
  }

  async findAll(paginationDto: PaginationDto): Promise<{ message: string; processo: ProcessoDto[] }> {
    try {
      const { limit: take, offset: skip } = paginationDto;

      const processo = await this.prisma.processo.findMany({
        take,
        skip,
        select: this.selectProcesso
      });

      return { message: 'Processo successfully retrieved', processo };
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      }

      throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findOne(id: string): Promise<{ message: string; processo: ProcessoDto }> {
    try {
      const processo = await this.prisma.processo.findUnique({
        where: { id },
        select: this.selectProcesso
      });

      if (!processo) {
        throw new HttpException('Processo not found', HttpStatus.NOT_FOUND);
      }

      return { message: 'Processo successfully retrieved', processo };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.error(error);
      throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  async create(createProcessoDto: CreateProcessoDto): Promise<{ message: string; processo: ProcessoDto }> {
    try {
      const { numeroProcesso, tipo, status, clientId, responsavelId, parteContraria } = createProcessoDto;

      const existingProcesso = await this.prisma.processo.findUnique({
        where: { numeroProcesso }
      });

      if (existingProcesso) {
        throw new HttpException('Process number already exists', HttpStatus.CONFLICT);
      }

      const clientExists = await this.prisma.client.findUnique({
        where: { id: clientId }
      });

      if (!clientExists) {
        throw new HttpException('Client not found', HttpStatus.NOT_FOUND);
      }

      const responsavelExists = await this.prisma.user.findUnique({
        where: { id: responsavelId }
      });

      if (!responsavelExists) {
        throw new HttpException('Responsible lawyer not found', HttpStatus.NOT_FOUND);
      }

      const processo = await this.prisma.processo.create({
        data: {
          numeroProcesso,
          tipo,
          status: status || 'ATIVO',
          clientId,
          responsavelId,
          parteContraria
        },
        select: this.selectProcesso
      });

      return { message: 'Processo created successfully', processo };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.error(error);
      throw new HttpException('Failed to create processo', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async update(id: string, updateProcessoDto: UpdateProcessoDto): Promise<{ message: string; processo: ProcessoDto }> {
    try {
      const existingProcesso = await this.prisma.processo.findUnique({
        where: { id }
      });

      if (!existingProcesso) {
        throw new HttpException('Processo not found', HttpStatus.NOT_FOUND);
      }

      if (updateProcessoDto.numeroProcesso && updateProcessoDto.numeroProcesso !== existingProcesso.numeroProcesso) {
        const duplicateProcesso = await this.prisma.processo.findUnique({
          where: { numeroProcesso: updateProcessoDto.numeroProcesso }
        });

        if (duplicateProcesso) {
          throw new HttpException('Process number already exists', HttpStatus.CONFLICT);
        }
      }

      if (updateProcessoDto.clientId) {
        const clientExists = await this.prisma.client.findUnique({
          where: { id: updateProcessoDto.clientId }
        });

        if (!clientExists) {
          throw new HttpException('Client not found', HttpStatus.NOT_FOUND);
        }
      }

      if (updateProcessoDto.responsavelId) {
        const responsavelExists = await this.prisma.user.findUnique({
          where: { id: updateProcessoDto.responsavelId }
        });

        if (!responsavelExists) {
          throw new HttpException('Responsible lawyer not found', HttpStatus.NOT_FOUND);
        }
      }

      const processo = await this.prisma.processo.update({
        where: { id },
        data: updateProcessoDto,
        select: this.selectProcesso
      });

      return { message: 'Processo updated successfully', processo };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.error(error);
      throw new HttpException('Failed to update processo', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    try {
      const existingProcesso = await this.prisma.processo.findUnique({
        where: { id }
      });

      if (!existingProcesso) {
        throw new HttpException('Processo not found', HttpStatus.NOT_FOUND);
      }

      await this.prisma.processo.delete({
        where: { id }
      });

      return { message: 'Processo deleted successfully' };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.error(error);
      throw new HttpException('Failed to delete processo', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
