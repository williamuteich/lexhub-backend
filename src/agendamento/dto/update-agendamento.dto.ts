import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateAgendamentoDto } from './create-agendamento.dto';

export class UpdateAgendamentoDto extends PartialType(
  OmitType(CreateAgendamentoDto, ['clientId'] as const)
) {}
