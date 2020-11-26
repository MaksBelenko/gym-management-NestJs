import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';
import { refreshJwtConfig, accessJwtConfig, JwtConfig } from './constants/jwt.config';
import { UserRepository } from './user.repository';
import { AuthCredentialsDto } from './dto/auth-credential.dto';
import { TokensResponseDto } from './dto/tokens-response.dto';
import { TokensService } from '../Shared-Modules/tokens/tokens.service';
import { TokenRefreshDto } from './dto/token-refresh.dto';
import { User } from './user.entity';

@Injectable()
export class AuthService {

    constructor (
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
        private tokenService: TokensService,
    ) {}


    async signUp(authCredentialsDto: AuthCredentialsDto): Promise<TokensResponseDto> {
        const user = await this.userRepository.signUp(authCredentialsDto);

        const { email } = user;
        const payload: JwtPayload = { email };
        return this.tokenService.generateAllTokens(payload);
    }


    async signIn(authCredentialsDto: AuthCredentialsDto): Promise<TokensResponseDto> {
        const email = await this.userRepository.validateUserPassword(authCredentialsDto);

        if (!email) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const payload: JwtPayload = { email };
        return this.tokenService.generateAllTokens(payload);
    }

    async tokenRefreshForUser(user: User): Promise<TokensResponseDto> {
        return new TokensResponseDto("test", "test");
    }

}
