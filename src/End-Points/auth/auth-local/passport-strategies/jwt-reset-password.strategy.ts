import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { JwtPayload } from '../../jwt-payload.interface';
import { UserRepository } from '../../user.repository';
import { accessJwtConfig, resetPasswordJwtConfig } from '../../constants/jwt.config';
import { User } from '../../user.entity';
import { TokensService } from '../../../../Shared-Modules/tokens/tokens.service';

export const JwtResetPasswordStrategyName: string = 'jwt-reset-password';


@Injectable()
export class JwtResetPasswordStrategy extends PassportStrategy(
    Strategy,
    JwtResetPasswordStrategyName,
) {

    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
    ) {
        super({
            passReqToCallback: true,
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: resetPasswordJwtConfig.secret,
        });
    }

    async validate(req: any, payload: JwtPayload): Promise<User> {

        const { email } = payload;
        const user = await this.userRepository.findOne({ email });

        if (!user) {
            throw new UnauthorizedException();
        }

        return user;
    }
}