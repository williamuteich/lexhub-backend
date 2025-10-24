import { CacheModuleAsyncOptions } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-yet';
import { Logger } from '@nestjs/common';

export const RedisCacheConfig: CacheModuleAsyncOptions = {
  isGlobal: true,
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => {
    const logger = new Logger('RedisCacheConfig');
    const redisUrl = configService.get<string>('REDIS_URL');

    logger.log(`🔍 REDIS_URL encontrada: ${redisUrl ? 'SIM' : 'NÃO'}`);

    // Railway (produção) - usa REDIS_URL
    if (redisUrl) {
      logger.log(`🚂 Conectando via REDIS_URL (Railway)`);
      const store = await redisStore({
        url: redisUrl,
        ttl: 600000,
      });

      return {
        store: () => store,
      };
    }

    // Local (desenvolvimento) - usa REDIS_HOST/PORT/PASSWORD
    const host = configService.get<string>('REDIS_HOST', 'localhost');
    const port = configService.get<number>('REDIS_PORT', 6379);
    logger.log(`🏠 Conectando via HOST/PORT: ${host}:${port} (Local)`);

    const store = await redisStore({
      socket: {
        host,
        port,
      },
      password: configService.get<string>('REDIS_PASSWORD'),
      ttl: 600000,
    });

    return {
      store: () => store,
    };
  },
  inject: [ConfigService],
};
