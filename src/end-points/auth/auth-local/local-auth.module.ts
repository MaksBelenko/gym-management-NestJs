import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocalAuthController } from './local-auth.controller';
import { LocalAuthService } from './local-auth.service';
import { UserRepository } from '../user.repository';
import { JwtResetPasswordStrategy } from './passport-strategies/jwt-reset-password.strategy';
import { MailSenderModule } from '../../../shared-modules/mail-sender/mail-sender.module';
import { TokensModule } from '../../../shared-modules/tokens/tokens.module';
import serverConfig from '../../../config/server.config';
import awsConfig from '../../../config/aws.config';
import jwtConfig from '../../../config/jwt.config';
import { JwtEmailConfirmationStrategy } from './passport-strategies/jwt-email-confirmation.strategy';

@Module({
    imports: [
        ConfigModule.forFeature(serverConfig),
        ConfigModule.forFeature(awsConfig),
        ConfigModule.forFeature(jwtConfig),
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
        JwtResetPasswordStrategy,
        JwtEmailConfirmationStrategy,
    ],
    exports: [
        // JwtAccessStrategy,
    ]
})
export class LocalAuthModule {}
