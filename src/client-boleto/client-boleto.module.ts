import { Module } from '@nestjs/common';
import { ClientBoletoService } from './client-boleto.service';
import { ClientBoletoController } from './client-boleto.controller';
import { StorageModule } from 'src/storage/storage.module';
import { EntityExistsValidator } from 'src/common/validators/entity-exists.validator';

@Module({
  imports: [StorageModule],
  controllers: [ClientBoletoController],
  providers: [ClientBoletoService, EntityExistsValidator],
})
export class ClientBoletoModule {}
