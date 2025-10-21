import { Module } from '@nestjs/common';
import { ProcessoService } from './processo.service';
import { ProcessoController } from './processo.controller';

@Module({
  controllers: [ProcessoController],
  providers: [ProcessoService],
})
export class ProcessoModule {}
