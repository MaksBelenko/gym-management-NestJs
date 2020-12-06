import { Module } from '@nestjs/common';
import { TokensService } from './tokens.service';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtTokensRepository } from './token.repository';
import { RedisCacheModule } from '../redis-cache/redis-cache.module';

@Module({
  imports: [
    JwtModule.register({}),
    TypeOrmModule.forFeature([JwtTokensRepository]),
    RedisCacheModule,
  ],
  providers: [TokensService],
  exports: [TokensService]
})
export class TokensModule {}
