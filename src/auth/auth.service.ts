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

    async tokenRefresh(tokenRefreshDto: TokenRefreshDto): Promise<TokensResponseDto> {
        return new TokensResponseDto("test", "test");
    }


    // private async generateAllTokens(payload: JwtPayload): Promise<TokensResponseDto> {
    //     const accessToken = await this.generateToken(payload, accessJwtConfig);
    //     const refreshToken = await this.generateToken(payload, refreshJwtConfig);

    //     return new TokensResponseDto(accessToken, refreshToken);
    // }

    // private async generateToken(payload: JwtPayload, config: JwtConfig): Promise<string> {
    //     return this.jwtService.sign(payload, {
    //         secret: config.secret,
    //         expiresIn: config.expiresIn
    //     });
    // }
}
