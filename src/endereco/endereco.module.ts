import { Module } from '@nestjs/common';
import { EnderecoService } from './endereco.service';
import { EnderecoController } from './endereco.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ViaCepModule } from 'src/viacep/viacep.module';

@Module({
  imports: [PrismaModule, ViaCepModule],
  controllers: [EnderecoController],
  providers: [EnderecoService],
})
export class EnderecoModule {}
