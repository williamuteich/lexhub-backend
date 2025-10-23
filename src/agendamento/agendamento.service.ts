import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAgendamentoDto } from './dto/create-agendamento.dto';
import { UpdateAgendamentoDto } from './dto/update-agendamento.dto';
import { AgendamentoDto } from './dto/agendamento.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { EntityExistsValidator } from 'src/common/validators/entity-exists.validator';
import { MESSAGES } from 'src/common/constants/messages.constant';

@Injectable()
export class AgendamentoService {
  private readonly selectAgendamento = {
    id: true,
    clientId: true,
    titulo: true,
    descricao: true,
    dataHora: true,
    local: true,
    link: true,
    createdAt: true,
    updatedAt: true,
  };

  constructor(
    private readonly prisma: PrismaService,
    private readonly validator: EntityExistsValidator,
  ) {}

  async findAll(paginationDto: PaginationDto): Promise<{ message: string; agendamentos: AgendamentoDto[] }> {
    const { limit, offset } = paginationDto;
    const agendamentos = await this.prisma.agendamento.findMany({
      take: limit,
      skip: offset,
      select: this.selectAgendamento,
      orderBy: { dataHora: 'asc' },
    });

    return { 
      message: MESSAGES.SUCCESS.RETRIEVED('Agendamentos'), 
      agendamentos 
    };
  }

  async findOne(id: string): Promise<{ message: string; agendamento: AgendamentoDto }> {
    const agendamento = await this.prisma.agendamento.findUnique({
      where: { id },
      select: this.selectAgendamento
    });

    if (!agendamento) {
      throw new HttpException(MESSAGES.NOT_FOUND.AGENDAMENTO, HttpStatus.NOT_FOUND);
    }
    
    return { 
      message: MESSAGES.SUCCESS.RETRIEVED('Agendamento'), 
      agendamento 
    };
  }

  async findByClient(clientId: string, paginationDto: PaginationDto): Promise<{ message: string; agendamentos: AgendamentoDto[] }> {
    await this.validator.validateClientExists(clientId);

    const { limit, offset } = paginationDto;
    const agendamentos = await this.prisma.agendamento.findMany({
      where: { clientId },
      take: limit,
      skip: offset,
      select: this.selectAgendamento,
      orderBy: { dataHora: 'asc' },
    });

    return { 
      message: MESSAGES.SUCCESS.RETRIEVED('Agendamentos'), 
      agendamentos 
    };
  }

  async create(createAgendamentoDto: CreateAgendamentoDto): Promise<{ message: string; agendamento: AgendamentoDto }> {
    await this.validator.validateClientExists(createAgendamentoDto.clientId);
    
    const dataHora = new Date(createAgendamentoDto.dataHora);
    await this.validator.validateAgendamentoTimeSlot(createAgendamentoDto.clientId, dataHora);

    const agendamento = await this.prisma.agendamento.create({
      data: {
        ...createAgendamentoDto,
        dataHora,
      },
      select: this.selectAgendamento
    });
    
    return { 
      message: MESSAGES.SUCCESS.CREATED('Agendamento'), 
      agendamento 
    };
  }

  async update(id: string, updateAgendamentoDto: UpdateAgendamentoDto): Promise<{ message: string; agendamento: AgendamentoDto }> {
    await this.validator.validateAgendamentoExists(id);
    
    const agendamento = await this.prisma.agendamento.findUnique({ where: { id } });
    if (!agendamento) {
      throw new HttpException(MESSAGES.NOT_FOUND.AGENDAMENTO, HttpStatus.NOT_FOUND);
    }

    const updateData: any = { ...updateAgendamentoDto };
    if (updateAgendamentoDto.dataHora) {
      updateData.dataHora = new Date(updateAgendamentoDto.dataHora);
      await this.validator.validateAgendamentoTimeSlot(agendamento.clientId, updateData.dataHora, id);
    }

    const updatedAgendamento = await this.prisma.agendamento.update({
      where: { id },
      data: updateData,
      select: this.selectAgendamento,
    });

    return { 
      message: MESSAGES.SUCCESS.UPDATED('Agendamento'), 
      agendamento: updatedAgendamento 
    };
  }

  async remove(id: string): Promise<{ message: string }> {
    await this.validator.validateAgendamentoExists(id);

    await this.prisma.agendamento.delete({ where: { id } });

    return { message: MESSAGES.SUCCESS.DELETED('Agendamento') };
  }
}
