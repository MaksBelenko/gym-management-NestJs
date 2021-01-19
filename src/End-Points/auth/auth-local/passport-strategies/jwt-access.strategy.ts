import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { JwtPayload } from '../../../../Shared-Modules/tokens/jwt-payload.interface';
import { TokensService } from '../../../../Shared-Modules/tokens/tokens.service'
import { UserRepository } from '../../user.repository';
import { accessJwtConfig } from '../../constants/jwt.config';

export const JwtAccessStrategyName: string = 'jwt-access-strategy';


@Injectable()
export class JwtAccessStrategy extends PassportStrategy(
    Strategy,
    JwtAccessStrategyName,
) {

    constructor(
        private readonly tokenService: TokensService,
        @InjectRepository(UserRepository) private userRepository: UserRepository,
    ) {
        super({
            passReqToCallback: true,
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: accessJwtConfig.secret,
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
