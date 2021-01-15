import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { JwtPayload } from '../jwt-payload.interface';
import { UserRepository } from '../user.repository';
import { accessJwtConfig } from '../constants/jwt.config';
import { User } from '../user.entity';
import { TokensService } from '../../../Shared-Modules/tokens/tokens.service';

export const JwtAccessStrategyName: string = 'jwt-access-strategy';


@Injectable()
export class JwtAccessStrategy extends PassportStrategy(
    Strategy,
    JwtAccessStrategyName,
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
            secretOrKey: accessJwtConfig.secret,
        });
    }

    async validate(req: any, payload: JwtPayload): Promise<User> {

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
