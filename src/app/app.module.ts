import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from 'src/user/user.module';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthModule } from 'src/auth/auth.module';
import { StorageModule } from 'src/storage/storage.module';
import { ClientModule } from 'src/client/client.module';
import { EnderecoModule } from 'src/endereco/endereco.module';
import { DocumentModule } from 'src/documento/document.module';
import { ProcessoModule } from 'src/processo/processo.module';
import { DocumentoProcessoModule } from 'src/documento-processo/documento-processo.module';
import { EmailModule } from 'src/email/email.module';
import { PasswordResetModule } from 'src/password-reset/password-reset.module';
import { AgendamentoModule } from 'src/agendamento/agendamento.module';

@Module({
  imports: [
    ConfigModule.forRoot(), 
    PrismaModule,
    AuthModule,
    UserModule, 
    ClientModule,
    StorageModule,
    EnderecoModule,
    DocumentModule,
    ProcessoModule,
    DocumentoProcessoModule,
    EmailModule,
    PasswordResetModule,
    AgendamentoModule,
    ThrottlerModule.forRoot([
      { name: 'short', ttl: 1000, limit: 3 },
      { name: 'medium', ttl: 10000, limit: 30 },
      { name: 'long', ttl: 60000, limit: 105 },
    ]),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}
