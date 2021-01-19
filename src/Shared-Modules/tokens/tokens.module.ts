import { Module } from '@nestjs/common';
import { TokensService } from './tokens.service';
import { JwtModule } from '@nestjs/jwt';
import { RedisCacheModule } from '../redis-cache/redis-cache.module';

@Module({
  imports: [
    JwtModule.register({}),
    RedisCacheModule,
  ],
  providers: [
    TokensService,
  ],
  exports: [TokensService]
})
export class TokensModule {}
