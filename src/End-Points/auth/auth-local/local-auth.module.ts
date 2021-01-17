import { Module, Inject } from '@nestjs/common';
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
import { TokensService } from '../../../Shared-Modules/tokens/tokens.service';
import { AccessJwtGuard } from './guards/access-jwt.guard';
import { RolesGuard } from '../RBAC/roles.guard';

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
        // {
        //     provide: JwtAccessStrategy,
        //     useFactory: async (tokensService: TokensService, userRepository: UserRepository) => {
        //         return new JwtAccessStrategy(tokensService, userRepository);
        //     },
        //     inject : [
        //         TokensService,
        //         UserRepository
        //     ]
        // },
        JwtAccessStrategy,
        JwtRefreshStrategy,
        RenewTokensStrategy,
        AccessJwtGuard,
        RolesGuard
    ],
    exports: [
        JwtAccessStrategy,
    ]
})
export class LocalAuthModule {}
