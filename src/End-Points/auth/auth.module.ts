import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserRepository } from './user.repository';
import { JwtAccessStrategy } from './passport-strategies/jwt-access.strategy';
import { JwtRefreshStrategy } from './passport-strategies/jwt-refresh.strategy';
import { TokensModule } from '../../Shared-Modules/tokens/tokens.module';
import { RenewTokensStrategy } from './passport-strategies/renew-tokens.strategy';
import { GoogleAuthController } from './google-auth/google-auth.controller';
import { GoogleAuthService } from './google-auth/google-auth.service';
import { GoogleStrategy } from './passport-strategies/google.strategy';
import { MailSenderModule } from '../../Shared-Modules/mail-sender/mail-sender.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }), 
    JwtModule.register({}),
    TypeOrmModule.forFeature([UserRepository]),
    TokensModule,
    MailSenderModule,
    ConfigModule,
  ],
  controllers: [
    AuthController,
    GoogleAuthController,
  ],
  providers: [
    AuthService,
    JwtAccessStrategy,
    JwtRefreshStrategy,
    RenewTokensStrategy,
    GoogleAuthService,
    GoogleStrategy
  ],
  exports: [
    JwtAccessStrategy,
    JwtRefreshStrategy,
    PassportModule,
  ]
})
export class AuthModule {}
