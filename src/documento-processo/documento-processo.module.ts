import { Module } from '@nestjs/common';
import { DocumentoProcessoService } from './documento-processo.service';
import { DocumentoProcessoController } from './documento-processo.controller';
import { StorageModule } from 'src/storage/storage.module';
import { EntityExistsValidator } from 'src/common/validators/entity-exists.validator';

@Module({
  imports: [StorageModule],
  controllers: [DocumentoProcessoController],
  providers: [DocumentoProcessoService, EntityExistsValidator],
})
export class DocumentoProcessoModule {}
