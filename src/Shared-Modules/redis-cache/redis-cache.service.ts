import { CACHE_MANAGER, Inject, Injectable, Logger } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisCacheService {

    private readonly logger = new Logger(RedisCacheService.name);

    constructor(
        @Inject(CACHE_MANAGER) private readonly cache: Cache
    ) {}

    async get<T>(key: string): Promise<T> {
        return this.cache.get(key);
    }

    /**
     * Sets the key-value pair in cache
     * @param key Key to set
     * @param value Object for the key
     * @param ttl Expiry time in seconds
     */
    async set(key: string, value: any, ttl: number): Promise<any> {
        return this.cache.set(key, value, { ttl });
    }

    async del(key: string): Promise<any> {
        return this.cache.del(key);
    }
}
