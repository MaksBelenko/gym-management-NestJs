import { ClassProvider, Module } from '@nestjs/common';
import { TokenStorageService } from './token-storage.service';
import { LocalAuthTokenRepository } from './local-auth-token.repository';
import { TokenStorage } from '../tokens/token-storage.abstract';
import { RedisCacheService } from '../redis-cache/redis-cache.service';

const tokenStorageService: ClassProvider<TokenStorage> = {
    provide: TokenStorage,
    useClass: TokenStorageService
}

@Module({
    providers: [
        LocalAuthTokenRepository,
        TokenStorageService, 
        tokenStorageService,
    ],
    exports: [tokenStorageService],
})
export class TokenStorageModule {}
