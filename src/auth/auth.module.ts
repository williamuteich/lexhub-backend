import { Global, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ConfigModule, ConfigType } from '@nestjs/config';
import jwtConfig from './config/jwt.config';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { HashingServiceProtocol } from './hashingPassword/hashing.service';
import { BcryptService } from './hashingPassword/bcrypt.service';
import { AuthTokenGuard } from './guard/auth-token.guard';
import { RolesGuard } from './guard/roles.guard';

@Global()
@Module({
  imports: [
    PrismaModule, 
    ConfigModule.forFeature(jwtConfig), 
    JwtModule.registerAsync({
      inject: [jwtConfig.KEY],
      useFactory: (config: ConfigType<typeof jwtConfig>): JwtModuleOptions => ({
        secret: config.secret,
        signOptions: {
          expiresIn: config.expiresIn,
          algorithm: config.algorithm,
        },
      }),
    })
  ],
  providers: [
    {
      provide: HashingServiceProtocol,
      useClass: BcryptService,
    },
    AuthService,
    AuthTokenGuard,
    RolesGuard
  ],
  exports: [HashingServiceProtocol, JwtModule, ConfigModule, AuthTokenGuard, RolesGuard],
  controllers: [AuthController]
})
export class AuthModule { }
