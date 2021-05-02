import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TokensService } from './tokens.service';
import { RedisCacheModule } from '../redis-cache/redis-cache.module';
import { TokenStorageModule } from '../token-storage/token-storage.module';
import jwtConfig from '../../config/jwt.config';

@Module({
    imports: [
        ConfigModule.forFeature(jwtConfig),
        JwtModule.register({}),
        TokenStorageModule,
        // RedisCacheModule,
    ],
    providers: [TokensService],
    exports: [TokensService],
})
export class TokensModule {}
