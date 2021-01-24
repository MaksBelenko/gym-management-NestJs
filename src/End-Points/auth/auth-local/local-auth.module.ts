import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocalAuthController } from './local-auth.controller';
import { LocalAuthService } from './local-auth.service';
import { UserRepository } from '../user.repository';
import { JwtAccessStrategy } from './passport-strategies/jwt-access.strategy';
import { JwtRefreshStrategy } from './passport-strategies/jwt-refresh.strategy';
import { MailSenderModule } from '../../../Shared-Modules/mail-sender/mail-sender.module';
import { TokensModule } from '../../../Shared-Modules/tokens/tokens.module';
import serverConfig from '../../../config/server.config';
import awsConfig from '../../../config/aws.config';
import jwtConfig from 'src/config/jwt.config';

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
        JwtAccessStrategy,
        JwtRefreshStrategy,
    ],
    exports: [
        JwtAccessStrategy,
    ]
})
export class LocalAuthModule {}
