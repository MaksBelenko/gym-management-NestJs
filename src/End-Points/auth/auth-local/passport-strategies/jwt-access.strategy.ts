import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigType } from '@nestjs/config';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { JwtPayload } from '../../../../Shared-Modules/tokens/jwt-payload.interface';
import { TokensService } from '../../../../Shared-Modules/tokens/tokens.service'
import { UserRepository } from '../../user.repository';
import jwtConfiguration from '../../../../config/jwt.config';

export const JwtAccessStrategyName: string = 'jwt-access-strategy';


@Injectable()
export class JwtAccessStrategy extends PassportStrategy(
    Strategy,
    JwtAccessStrategyName,
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
            secretOrKey: jwtConfig.accessJwt.secret,
        });
    }

    async validate(req: any, payload: any): Promise<JwtPayload> {

        const header = req.headers.authorization;
        const existingToken = await this.tokenService.tokenExists(header);

        if (!existingToken) {
            throw new UnauthorizedException();
        }

        const user: JwtPayload = { 
            email: payload.email, 
            role: payload.role, 
        };

        return user; // returns as req.user property
    }
}
