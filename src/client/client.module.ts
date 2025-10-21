import { Module } from '@nestjs/common';
import { ClientService } from './client.service';
import { ClientController } from './client.controller';
import { StorageModule } from 'src/storage/storage.module';
import { EntityExistsValidator } from 'src/common/validators/entity-exists.validator';

@Module({
  imports: [StorageModule],
  controllers: [ClientController],
  providers: [ClientService, EntityExistsValidator],
})
export class ClientModule {}
