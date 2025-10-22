import { Module } from '@nestjs/common';
import { DocumentService } from './document.service';
import { DocumentController } from './document.controller';
import { StorageModule } from 'src/storage/storage.module';
import { EntityExistsValidator } from 'src/common/validators/entity-exists.validator';

@Module({
  imports: [StorageModule],
  controllers: [DocumentController],
  providers: [DocumentService, EntityExistsValidator],
})
export class DocumentModule {}
