import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { JwtPayload } from '../../../../shared-modules/tokens/jwt-payload.interface';
import { UserRepository } from '../../user.repository';
import { User } from '../../user.entity';
import jwtConfiguration from '../../../../config/jwt.config';

export const JwtResetPasswordStrategyName = 'jwt-reset-password';
export const JwtPasswordResetQueryParamName = 't';


@Injectable()
export class JwtResetPasswordStrategy extends PassportStrategy(
    Strategy,
    JwtResetPasswordStrategyName,
) {

    constructor(
        @InjectRepository(UserRepository) private userRepository: UserRepository,
        @Inject(jwtConfiguration.KEY) private readonly jwtConfig: ConfigType<typeof jwtConfiguration>,
    ) {
        super({
            passReqToCallback: true,
            jwtFromRequest: ExtractJwt.fromUrlQueryParameter(JwtPasswordResetQueryParamName),
            ignoreExpiration: false,
            secretOrKey: jwtConfig.passwordResetJwt.secret,
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