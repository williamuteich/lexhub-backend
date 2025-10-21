import { Module } from '@nestjs/common';
import { ProcessoService } from './processo.service';
import { ProcessoController } from './processo.controller';
import { EntityExistsValidator } from 'src/common/validators/entity-exists.validator';

@Module({
  controllers: [ProcessoController],
  providers: [ProcessoService, EntityExistsValidator],
})
export class ProcessoModule {}
