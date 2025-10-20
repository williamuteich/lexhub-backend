import { Module } from '@nestjs/common';
import { EnderecoService } from './endereco.service';
import { EnderecoController } from './endereco.controller';
import { ViaCepModule } from 'src/viacep/viacep.module';

@Module({
  imports: [ViaCepModule],
  controllers: [EnderecoController],
  providers: [EnderecoService],
})
export class EnderecoModule {}
