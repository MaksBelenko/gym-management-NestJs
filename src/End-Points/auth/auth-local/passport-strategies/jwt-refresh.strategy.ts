import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { refreshJwtConfig } from '../../constants/jwt.config';
import { UserRepository } from '../../user.repository';
import { User } from '../../user.entity';
import { TokensService } from '../../../../Shared-Modules/tokens/tokens.service';


export const JwtRefreshStrategyName = 'jwt-refresh-strategy';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
    Strategy,
    JwtRefreshStrategyName,
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

    async validate(req: any, payload: any): Promise<User> {

        const header = req.headers.authorization;
        const existingToken = await this.tokenService.tokenExists(header);

        if (!existingToken) {
            throw new UnauthorizedException();
        }

        const { email } = payload;
        const user = await this.userRepository.findOne({ email });

        if (!user) {
            throw new UnauthorizedException();
        }

        return user;
    }
}
