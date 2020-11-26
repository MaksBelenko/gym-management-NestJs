import { Module } from '@nestjs/common';
import { TokensService } from './tokens.service';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtTokensRepository } from './token.repository';

@Module({
  imports: [
    JwtModule.register({}),
    TypeOrmModule.forFeature([JwtTokensRepository]),
  ],
  providers: [TokensService],
  exports: [TokensService]
})
export class TokensModule {}
