import { ClassProvider, Module } from '@nestjs/common';
import { TokenStorageService } from './token-storage.service';
import { LocalAuthTokenRepository } from './local-auth-token.repository';
import { TokenStorage } from '../tokens/token-storage.abstract';
import { RedisCacheService } from '../redis-cache/redis-cache.service';
import { ConfigModule } from '@nestjs/config';
import localTokenConfig from '../../config/local-token.config';

const tokenStorageService: ClassProvider<TokenStorage> = {
    provide: TokenStorage,
    useClass: TokenStorageService
}

@Module({
    imports: [
        ConfigModule.forFeature(localTokenConfig),
    ],
    providers: [
        LocalAuthTokenRepository,
        TokenStorageService, 
        tokenStorageService,
    ],
    exports: [tokenStorageService],
})
export class TokenStorageModule {}
