import { Module } from '@nestjs/common';
import { EnderecoService } from './endereco.service';
import { EnderecoController } from './endereco.controller';
import { ViaCepModule } from 'src/viacep/viacep.module';
import { EntityExistsValidator } from 'src/common/validators/entity-exists.validator';

@Module({
  imports: [ViaCepModule],
  controllers: [EnderecoController],
  providers: [EnderecoService, EntityExistsValidator],
})
export class EnderecoModule {}
