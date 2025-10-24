import { CacheModuleAsyncOptions } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-yet';

export const RedisCacheConfig: CacheModuleAsyncOptions = {
  isGlobal: true,
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => {
    const redisUrl = configService.get<string>('REDIS_URL');

    if (redisUrl && !redisUrl.includes('${{')) {
      const store = await redisStore({
        url: redisUrl,
        ttl: 600000, 
      });

      return {
        store: () => store,
      };
    }

    const host = configService.get<string>('REDIS_HOST') || 
                 configService.get<string>('REDISHOST') || 
                 'localhost';
    const port = configService.get<number>('REDIS_PORT') || 
                 configService.get<number>('REDISPORT') || 
                 6379;
    const password = configService.get<string>('REDIS_PASSWORD') || 
                     configService.get<string>('REDISPASSWORD');

    const store = await redisStore({
      socket: {
        host,
        port: Number(port),
      },
      password,
      ttl: 600000,
    });

    return {
      store: () => store,
    };
  },
  inject: [ConfigService],
};
