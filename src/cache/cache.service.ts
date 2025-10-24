import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger } from '@nestjs/common';
import type { Cache } from 'cache-manager';

@Injectable()
export class CacheService {
  private readonly logger = new Logger(CacheService.name);

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await this.cacheManager.get<T>(key);
      return value || null;
    } catch (error) {
      this.logger.error(`Cache get error for key ${key}:`, error);
      return null;
    }
  }

  async set(key: string, value: any, ttl?: number): Promise<void> {
    try {
      await this.cacheManager.set(key, value, ttl);
    } catch (error) {
      this.logger.error(`Cache set error for key ${key}:`, error);
    }
  }

  async del(key: string): Promise<void> {
    try {
      await this.cacheManager.del(key);
    } catch (error) {
      this.logger.error(`Cache del error for key ${key}:`, error);
    }
  }

  async reset(): Promise<void> {
    try {
      // Cast to any to access store's reset method
      const store = (this.cacheManager as any).store;
      if (store && typeof store.reset === 'function') {
        await store.reset();
      }
    } catch (error) {
      this.logger.error('Cache reset error:', error);
    }
  }

  async delPattern(pattern: string): Promise<void> {
    try {
      // Cast to any to access store
      const store = (this.cacheManager as any).store;
      if (store && typeof store.keys === 'function') {
        const keys = await store.keys(pattern);
        if (keys && keys.length > 0) {
          await Promise.all(keys.map((key: string) => this.cacheManager.del(key)));
        }
      }
    } catch (error) {
      this.logger.error(`Cache delPattern error for pattern ${pattern}:`, error);
    }
  }
}
