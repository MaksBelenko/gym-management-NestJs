import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocalAuthController } from './local-auth.controller';
import { LocalAuthService } from './local-auth.service';
import { UserRepository } from '../user.repository';
import { JwtResetPasswordStrategy } from './passport-strategies/jwt-reset-password.strategy';
import { MailSenderModule } from '../../../Shared-Modules/mail-sender/mail-sender.module';
import { TokensModule } from '../../../Shared-Modules/tokens/tokens.module';
import serverConfig from '../../../config/server.config';
import awsConfig from '../../../config/aws.config';
import jwtConfig from '../../../config/jwt.config';

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
        JwtResetPasswordStrategy
    ],
    exports: [
        // JwtAccessStrategy,
    ]
})
export class LocalAuthModule {}
