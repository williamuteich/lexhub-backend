import { CacheModuleAsyncOptions } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-yet';

export const RedisCacheConfig: CacheModuleAsyncOptions = {
  isGlobal: true,
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => {
    const redisUrl = configService.get<string>('REDIS_URL');

    // Railway (produção) - usa REDIS_URL
    if (redisUrl) {
      const store = await redisStore({
        url: redisUrl,
        ttl: 600000,
      });

      return {
        store: () => store,
      };
    }


    const store = await redisStore({
      socket: {
        host: configService.get<string>('REDIS_HOST', 'localhost'),
        port: configService.get<number>('REDIS_PORT', 6379),
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
