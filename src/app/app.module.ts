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
import { DocumentModule } from 'src/document/document.module';
import { ProcessoModule } from 'src/processo/processo.module';

@Module({
  imports: [
    ConfigModule.forRoot(), 
    UserModule, 
    ClientModule,
    StorageModule,
    EnderecoModule,
    DocumentModule,
    ProcessoModule,
    ThrottlerModule.forRoot([
      { name: 'short', ttl: 1000, limit: 3 },
      { name: 'medium', ttl: 10000, limit: 30 },
      { name: 'long', ttl: 60000, limit: 105 },
    ]),
    PrismaModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}
