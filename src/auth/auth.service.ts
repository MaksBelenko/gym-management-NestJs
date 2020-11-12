import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { AuthCredentialsDto } from './dto/auth-credential.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';
import { refreshJwtConfig, accessJwtConfig, JwtConfig } from './constants/jwt.config';
import { TokensResponseDto } from './dto/tokens-response.dto';

@Injectable()
export class AuthService {

    constructor (
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
        private jwtService: JwtService,
    ) {}


    async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
        return this.userRepository.signUp(authCredentialsDto);
    }

    async signIn(authCredentialsDto: AuthCredentialsDto): Promise<TokensResponseDto> {
        const username = await this.userRepository.validateUserPassword(authCredentialsDto);

        if (!username) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const accessPayload: JwtPayload = { username };
        const accessToken = await this.generateToken(accessPayload, accessJwtConfig);

        const refreshPayload: JwtPayload = { username };
        const refreshToken = await this.generateToken(refreshPayload, refreshJwtConfig);

        return new TokensResponseDto(accessToken, refreshToken);
    }

    private async generateToken(payload: JwtPayload, config: JwtConfig): Promise<string> {
        return this.jwtService.sign(payload, {
            secret: config.secret,
            expiresIn: config.expiresIn
        });
    }
}
