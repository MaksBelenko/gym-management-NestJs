import { Module } from '@nestjs/common';
import { TokensService } from './tokens.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({})
  ],
  providers: [
    TokensService
  ],
  exports: [TokensService]
})
export class TokensModule {}
