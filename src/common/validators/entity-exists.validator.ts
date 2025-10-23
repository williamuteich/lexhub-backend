import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EntityExistsValidator {
  constructor(private readonly prisma: PrismaService) { }

  async validateClientExists(clientId: string): Promise<void> {
    const client = await this.prisma.client.findUnique({
      where: { id: clientId }
    });

    if (!client) {
      throw new HttpException('Client not found', HttpStatus.NOT_FOUND);
    }
  }

  async validateUserExists(userId: string): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
  }

  async validateProcessoExists(processoId: string): Promise<void> {
    const processo = await this.prisma.processo.findUnique({
      where: { id: processoId }
    });

    if (!processo) {
      throw new HttpException('Processo not found', HttpStatus.NOT_FOUND);
    }
  }

  async validateEmailNotInUse(email: string, entityType: 'user' | 'client'): Promise<void> {
    const entity = entityType === 'user'
      ? await this.prisma.user.findUnique({ where: { email } })
      : await this.prisma.client.findUnique({ where: { email } });

    if (entity) {
      throw new HttpException(`${entityType === 'user' ? 'User' : 'Client'} already exists`, HttpStatus.CONFLICT);
    }
  }

  async validateProcessoNumberNotInUse(numeroProcesso: number, excludeId?: string): Promise<void> {
    const processo = await this.prisma.processo.findUnique({
      where: { numeroProcesso }
    });

    if (processo && processo.id !== excludeId) {
      throw new HttpException('Process number already exists', HttpStatus.CONFLICT);
    }
  }

  async validateAgendamentoExists(agendamentoId: string): Promise<void> {
    const agendamento = await this.prisma.agendamento.findUnique({
      where: { id: agendamentoId }
    });

    if (!agendamento) {
      throw new HttpException('Agendamento not found', HttpStatus.NOT_FOUND);
    }
  }

  async validateAgendamentoTimeSlot(clientId: string, dataHora: Date, excludeId?: string): Promise<void> {
    const now = new Date();
    const appointmentDate = new Date(dataHora);

    if (appointmentDate < now) {
      throw new HttpException(
        'Cannot schedule appointment for a past date',
        HttpStatus.BAD_REQUEST
      );
    }

    const endTime = new Date(appointmentDate);
    endTime.setHours(endTime.getHours() + 2);

    const conflictingAppointment = await this.prisma.agendamento.findFirst({
      where: {
        clientId,
        dataHora: {
          gte: appointmentDate,
          lt: endTime
        },
        ...(excludeId && { id: { not: excludeId } })
      }
    });

    if (conflictingAppointment) {
      throw new HttpException(
        'Appointment already exists for this date and time',
        HttpStatus.CONFLICT
      );
    }
  }
}
