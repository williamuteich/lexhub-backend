import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { StorageModule } from 'src/storage/storage.module';
import { EntityExistsValidator } from 'src/common/validators/entity-exists.validator';

@Module({
  imports: [StorageModule],
  controllers: [UserController],
  providers: [UserService, EntityExistsValidator],
})
export class UserModule {}
