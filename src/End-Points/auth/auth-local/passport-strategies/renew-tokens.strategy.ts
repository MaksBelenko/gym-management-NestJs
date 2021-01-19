import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { refreshJwtConfig } from '../../constants/jwt.config';
import { UserRepository } from '../../user.repository';
import { TokensService } from '../../../../Shared-Modules/tokens/tokens.service';
import { JwtPayload } from '../../../../Shared-Modules/tokens/jwt-payload.interface';


export const RenewTokensStrategyName = 'no-user-refresh-strategy';


@Injectable()
export class RenewTokensStrategy extends PassportStrategy(
    Strategy,
    RenewTokensStrategyName,
) {
    constructor(
        private readonly tokenService: TokensService,
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
    ) {
        super({
            passReqToCallback: true,
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: refreshJwtConfig.secret, // gets secret from environment variables
        });
    }

    async validate(req: any, payload: JwtPayload): Promise<{ refreshToken: string, payload: JwtPayload }> {

        const header = req.headers.authorization;
        const refreshToken = await this.tokenService.tokenExists(header);

        if (!refreshToken) {
            throw new UnauthorizedException();
        }

        return { refreshToken, payload };
    }
}