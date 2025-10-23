import { Module } from '@nestjs/common';
import { AgendamentoService } from './agendamento.service';
import { AgendamentoController } from './agendamento.controller';
import { EntityExistsValidator } from 'src/common/validators/entity-exists.validator';

@Module({
  controllers: [AgendamentoController],
  providers: [AgendamentoService, EntityExistsValidator],
})
export class AgendamentoModule {}
