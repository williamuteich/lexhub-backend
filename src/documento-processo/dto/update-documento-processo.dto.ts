import { PartialType } from '@nestjs/swagger';
import { CreateDocumentoProcessoDto } from './create-documento-processo.dto';

export class UpdateDocumentoProcessoDto extends PartialType(CreateDocumentoProcessoDto) {}