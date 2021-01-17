import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { LocalAuthController } from './local-auth.controller';
import { LocalAuthService } from './local-auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from '../user.repository';
import { JwtAccessStrategy } from './passport-strategies/jwt-access.strategy';
import { JwtRefreshStrategy } from './passport-strategies/jwt-refresh.strategy';
import { RenewTokensStrategy } from './passport-strategies/renew-tokens.strategy';
import { MailSenderModule } from 'src/Shared-Modules/mail-sender/mail-sender.module';
import { TokensModule } from 'src/Shared-Modules/tokens/tokens.module';

@Module({
    imports: [
        // PassportModule.register({ defaultStrategy: 'jwt' }), 
        JwtModule.register({}),
        TypeOrmModule.forFeature([UserRepository]),
        TokensModule,
        MailSenderModule,
    ],
    controllers: [
        LocalAuthController
    ],
    providers: [
        LocalAuthService,
        JwtAccessStrategy,
        JwtRefreshStrategy,
        RenewTokensStrategy,
    ],
    exports: [
        JwtAccessStrategy,
    ]
})
export class LocalAuthModule {}
