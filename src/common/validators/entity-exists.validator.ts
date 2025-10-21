import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EntityExistsValidator {
  constructor(private readonly prisma: PrismaService) {}

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
}
