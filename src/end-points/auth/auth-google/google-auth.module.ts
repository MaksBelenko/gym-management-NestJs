import { Module } from '@nestjs/common';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { GoogleStrategy } from './passport-strategies/google.strategy';
import { GoogleAuthController } from './google-auth.controller';
import { GoogleAuthService } from './google-auth.service';
import * as Joi from '@hapi/joi';
import googleConfig from 'src/config/google.config';
import serverConfig from 'src/config/server.config';

@Module({
    imports: [
        ConfigModule.forFeature(googleConfig),
        ConfigModule.forFeature(serverConfig),
    ],
    controllers: [
        GoogleAuthController,
    ],
    providers: [
        GoogleAuthService,
        GoogleStrategy,
    ]
})
export class GoogleAuthModule {}
