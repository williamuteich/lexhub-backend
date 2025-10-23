import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateClientBoletoDto } from './create-client-boleto.dto';

export class UpdateClientBoletoDto extends PartialType(
  OmitType(CreateClientBoletoDto, ['clientId'] as const)
) {}
