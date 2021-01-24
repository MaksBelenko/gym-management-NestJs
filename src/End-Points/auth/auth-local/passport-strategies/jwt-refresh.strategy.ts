import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { UserRepository } from '../../user.repository';
import { User } from '../../user.entity';
import { TokensService } from '../../../../Shared-Modules/tokens/tokens.service';
import jwtConfiguration from '../../../../config/jwt.config';
import { JwtPayload } from 'src/Shared-Modules/tokens/jwt-payload.interface';


export const JwtRefreshStrategyName = 'jwt-refresh-strategy';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
    Strategy,
    JwtRefreshStrategyName,
) {
    constructor(
        private readonly tokenService: TokensService,
        @InjectRepository(UserRepository) private userRepository: UserRepository,
        @Inject(jwtConfiguration.KEY) private readonly jwtConfig: ConfigType<typeof jwtConfiguration>,
    ) {
        super({
            passReqToCallback: true,
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: jwtConfig.refreshJwt.secret, // gets secret from environment variables
        });
    }

    async validate(req: any, payload: JwtPayload): Promise<JwtPayload> {

        const authHeader = req.headers.authorization;
        const refreshToken = await this.tokenService.tokenExists(authHeader);

        if (!refreshToken) {
            throw new UnauthorizedException();
        }

        req.jwtRefreshToken = refreshToken;

        return payload;
    }
}
