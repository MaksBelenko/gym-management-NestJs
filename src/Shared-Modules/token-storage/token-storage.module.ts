import { Module } from '@nestjs/common';
import { TokenStorageService } from './token-storage.service';
import { LocalAuthTokenRepository } from './local-auth-token.repository';

@Module({
  providers: [
    LocalAuthTokenRepository,
    TokenStorageService,
  ],
  exports: [TokenStorageService],
})
export class TokenStorageModule {}
