import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { APP_GUARD } from '@nestjs/core';
import { JwtAccessStrategy } from './auth-local/passport-strategies/jwt-access.strategy';
import { LocalAuthModule } from './auth-local/local-auth.module';
import { GoogleAuthModule } from './auth-google/google-auth.module';

@Module({
  imports: [
    LocalAuthModule,
    GoogleAuthModule,
    PassportModule.register({}), 
  ],
  providers: [
    // {
    //   provide: APP_GUARD,
    //   useClass: AccessJwtGuard, // SETS GLOBAL GUARD AS ACCESS TOKEN
    // }    
  ],
  exports: [
    LocalAuthModule,
    PassportModule,
  ],
})
export class AuthModule {}
