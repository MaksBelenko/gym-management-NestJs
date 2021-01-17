import { Module } from '@nestjs/common';
import { GoogleStrategy } from './passport-strategies/google.strategy';
import { GoogleAuthController } from './google-auth.controller';
import { GoogleAuthService } from './google-auth.service';

@Module({
    controllers: [
        GoogleAuthController,
    ],
    providers: [
        GoogleAuthService,
        GoogleStrategy,
    ]
})
export class GoogleAuthModule {}
