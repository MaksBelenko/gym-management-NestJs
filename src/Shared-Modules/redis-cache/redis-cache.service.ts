import { CACHE_MANAGER, Inject, Injectable, Logger } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisCacheService {

    private readonly logger = new Logger(RedisCacheService.name);

    constructor(
        @Inject(CACHE_MANAGER) private readonly cache: Cache
    ) {}

    async get(key: string): Promise<any> {
        return this.cache.get(key);
    }

    async set(key: string, value: any): Promise<any> {
        return this.cache.set(key, value, 60);
    }
}
